import './App.css';
import {useEffect, useState} from "react";

const initMouse = {
    x: 0, y: 0, width: 5, position: "right", isClick: false, moving: false, id: Math.random()
};

function App() {
    const getCoords = e => {
        if (e.pageX || e.pageY) {
            return {x: e.pageX, y: e.pageY};
        }
        return {
            x: e.clientX, y: e.clientY
        };
    };
    const options = ["right", "left", "up", "down"];

    const [position, setPosition] = useState(options[0])
    const [width, setWidth] = useState(5)
    const [mouseState, setMouseState] = useState(initMouse)
    const [drawings, setDrawings] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [move, setMove] = useState(true);
    const [lastLinesId, setLastLinesId] = useState(0)

    useEffect(() => {
        drawings.map((a, index) => {
            if (a.id === lastLinesId) {
                setWidth(a.width)
                // setMouseState(a)
            }
        })
    }, [lastLinesId])
    const down = e => {
        if (move) {
            let tempId = Math.random()
            if (dragging === false) {
                setWidth(5)
                setPosition(options[0])
                let mouseCoords = getCoords(e);
                setMouseState({
                    ...mouseState,
                    isClick: true,
                    x: mouseCoords.x,
                    y: mouseCoords.y,
                    width: width,
                    position: position,
                    moving: false,
                    id: tempId,
                });
                setDrawings([...drawings, ...[{
                    isClick: true,
                    x: mouseCoords.x,
                    y: mouseCoords.y,
                    width: 5,
                    position: position,
                    moving: false,
                    id: tempId,
                }]]);
            }
            setLastLinesId(tempId)
        }
    }
    const addTwoNumbers = (a, b) => {
        let c = parseInt(a) + parseInt(b)
        return c
    }
    const subTwoNumbers = (a, b) => {
        let c = parseInt(a) - parseInt(b)
        return c
    }

    const onWidthChange = (event) => {
        setWidth(event.target.value)
        drawings.map((a, index) => {
            if (a.id === lastLinesId) {
                a.width = event.target.value
            }
        })
    }
    const onPositionChange = (event) => {
        setPosition(event.target.value)
        drawings.map((a, index) => {
            if (a.id === lastLinesId) {
                a.position = event.target.value
            }
        })
    }

    const handleMouseDown = (e, a) => {
        setLastLinesId(a.id)
        if (!move) {
            setDragging(true);
            let pageX = e.clientX
            let pageY = e.clientY
            if (a.position === "right") {
                a.x = pageX
                a.y = pageY
                a.x1 = addTwoNumbers(pageX, a.width)
                a.y1 = pageY - 22
                a.moving = true
            } else if (a.position === "left") {
                a.x = pageX
                a.y = pageY
                a.x1 = subTwoNumbers(pageX, a.width)
                a.y1 = pageY - 22
                a.moving = true
            } else if (a.position === "up") {
                a.x = pageX
                a.y = pageY
                a.x1 = pageX
                a.y1 = subTwoNumbers(pageY, a.width) - 22
                a.moving = true
            } else {
                a.x = pageX
                a.y = pageY
                a.x1 = pageX
                a.y1 = addTwoNumbers(pageY, a.width) - 22
                a.moving = true
            }

            document.addEventListener('mousemove', handleMouseMove);
        }

    }

    function handleMouseUp() {
        setDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        drawings.map((a, index) => {
            if (a.moving === true) {
                a.moving = false
            }
        })
    }


    const handleMouseMove = (e) => {
        let pageX = e.clientX
        let pageY = e.clientY
        drawings.map((a, index) => {
            if (a.moving === true) {
                if (a.position === "right") {
                    a.x = pageX
                    a.y = pageY
                    a.x1 = addTwoNumbers(pageX, a.width)
                    a.y1 = pageY - 22
                } else if (a.position === "left") {
                    a.x = pageX
                    a.y = pageY
                    a.x1 = subTwoNumbers(pageX, a.width)
                    a.y1 = pageY - 22
                } else if (a.position === "up") {
                    a.x = pageX
                    a.y = pageY
                    a.x1 = pageX
                    a.y1 = subTwoNumbers(pageY, a.width) - 22
                } else {
                    a.x = pageX
                    a.y = pageY
                    a.x1 = pageX
                    a.y1 = addTwoNumbers(pageY, a.width) - 22
                }
            }
        })
    }

    function renderLines() {
        console.log("DRAWINGS::::::: ", drawings)
        return drawings.length > 0 ? (<>
            {drawings.map((a, index) => (<g key={index} style={{cursor: "default"}}>
                {a.position === "right" ? <line className={!move ? "draggable" : "default"}
                                                x1={a.x}
                                                y1={a.y - 22}
                                                x2={addTwoNumbers(a.x, a.width)}
                                                y2={a.y - 22}
                                                onClick={() => {
                                                    setDragging(true);
                                                }}
                                                onMouseDown={event => handleMouseDown(event, a)}
                                                style={{strokeWidth: 3, stroke: "black"}}/> : a.position === "down" ?
                    <line className={!move ? "draggable" : "default"}
                          x1={a.x}
                          y1={a.y - 22}
                          x2={a.x}
                          y2={addTwoNumbers(a.y, a.width) - 22}
                          onClick={() => {
                              setDragging(true)
                          }}
                          onMouseDown={event => handleMouseDown(event, a)}
                          style={{strokeWidth: 3, stroke: "red"}}
                    /> : a.position === "left" ? <line className={!move ? "draggable" : "default"}
                                                       x1={a.x}
                                                       y1={a.y - 22}
                                                       x2={subTwoNumbers(a.x, a.width)}
                                                       y2={a.y - 22}
                                                       onClick={() => {
                                                           setDragging(true)
                                                       }}
                                                       onMouseDown={event => handleMouseDown(event, a)}
                                                       style={{strokeWidth: 3, stroke: "blue"}}
                    /> : <line className={!move ? "draggable" : "default"}
                               x1={a.x}
                               y1={a.y - 22}
                               x2={a.x}
                               y2={subTwoNumbers(a.y, a.width) - 22}
                               onClick={() => {
                                   setDragging(true)
                               }}
                               onMouseDown={event => handleMouseDown(event, a)}
                               style={{strokeWidth: 3, stroke: "brown"}}
                    />}
            </g>))}
        </>) : <></>
    }

    return (<div className="App">
        <select
            onChange={onPositionChange}
            defaultValue={position}>
            {options.map((option, idx) => (<option key={idx}>{option}</option>))}
        </select>
        <label>
            Width :
            <input
                name="width"
                type="number"
                value={width}
                onChange={onWidthChange}
            />
        </label>
        <button onClick={() => {
            setMove(!move)
        }}>{move ? "Select" : "Line"}</button>
        <div>
            <svg className={move ? "sketching" : "default"} onMouseDown={down} onMouseUp={handleMouseUp} style={{
                backgroundColor: "yellowgreen", border: "1px solid gray", height: "500PX", width: "100%"
            }}>
                {renderLines()}
            </svg>
        </div>
    </div>);
}

export default App;
