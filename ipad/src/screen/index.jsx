// import { ColorSwatch, Group } from "@mantine/core";
// import { Button } from '../components/button';
// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import Draggable from "react-draggable";
// import { SWATCHES } from "../constants";


// export default function Home() {
//   const canvasRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [color, setColor] = useState("rgb(255, 255, 255)");
//   const [reset, setReset] = useState(false);
//   const [theme,setTheme]=useState(false);
//   const [dictOfVars, setDictOfVars] = useState({});
//   const [result, setResult] = useState(null);
//   const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
//   const [latexExpression, setLatexExpression] = useState([]);


//   useEffect(() => {
//     if (latexExpression.length > 0 && window.MathJax) {
//       setTimeout(() => {
//         window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
//       }, 0);
//     }
//   }, [latexExpression]);

//   useEffect(() => {
//     if (result) {
//       renderLatexToCanvas(result.expression, result.answer);
//     }
//   }, [result]);

//   useEffect(() => {
//     if (reset) {
//       resetCanvas();
//       setLatexExpression([]);
//       setResult(null);
//       setDictOfVars({});
//       setReset(false);
//     }
//   }, [reset]);

//   useEffect(() => {
//     const canvas = canvasRef.current;

//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight - canvas.offsetTop;
//         ctx.lineCap = "round";
//         ctx.lineWidth = 3;
//       }
//     }
//     const script = document.createElement("script");
//     script.src =
//       "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
//     script.async = true;
//     document.head.appendChild(script);

//     script.onload = () => {
//       window.MathJax.Hub.Config({
//         tex2jax: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
//       });
//     };

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, []);

//   const renderLatexToCanvas = (expression, answer) => {
//     const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
//     setLatexExpression([...latexExpression, latex]);

//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//       }
//     }
//   };

//   const resetCanvas = () => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//       }
//     }
//   };

//   const startDrawing = (e) => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       canvas.style.background = "black";
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.beginPath();
//         ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         setIsDrawing(true);
//       }
//     }
//   };

//   const draw = (e) => {
//     if (!isDrawing) {
//       return;
//     }
//     const canvas = canvasRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) {
//         ctx.strokeStyle = color;
//         ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
//         ctx.stroke();
//       }
//     }
//   };

//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };

//   const runRoute = async () => {
//     const canvas = canvasRef.current;

//     if (canvas) {
//       const response = await axios({
//         method: "post",
//         url: `http://localhost:8900/calculate`,
//         data: {
//           image: canvas.toDataURL("image/png"),
//           dict_of_vars: dictOfVars,
//         },
//       });

//       const resp = await response.data;
//       console.log("Response", resp);
//       resp.data.forEach((data) => {
//         if (data.assign === true) {
//           setDictOfVars({
//             ...dictOfVars,
//             [data.expr]: data.result,
//           });
//         }
//       });

//       const ctx = canvas.getContext("2d");
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       let minX = canvas.width,
//         minY = canvas.height,
//         maxX = 0,
//         maxY = 0;

//       for (let y = 0; y < canvas.height; y++) {
//         for (let x = 0; x < canvas.width; x++) {
//           const i = (y * canvas.width + x) * 4;
//           if (imageData.data[i + 3] > 0) {
//             minX = Math.min(minX, x);
//             minY = Math.min(minY, y);
//             maxX = Math.max(maxX, x);
//             maxY = Math.max(maxY, y);
//           }
//         }
//       }

//       const centerX = (minX + maxX) / 2;
//       const centerY = (minY + maxY) / 2;

//       setLatexPosition({ x: centerX, y: centerY });
//       resp.data.forEach((data) => {
//         setTimeout(() => {
//           setResult({
//             expression: data.expr,
//             answer: data.result,
//           });
//         }, 1000);
//       });
//     }
//   };

//   return (
//     <>
//       <div className="grid grid-cols-4 gap-2">
//         <Button
//           onClick={() => setReset(true)}
//           className="z-10 bg-blue-700 text-white"
//           variant="default"
//           color="black"
//         >
//           clear
//         </Button>
//         <Button
//         onClick={() => {
//             setTheme((prevTheme) => !prevTheme); // Toggle theme
//             const canvas = canvasRef.current;
//             if (canvas) {
//             const ctx = canvas.getContext("2d");
//             if (ctx) {
//                 // Change the canvas background color
//                 ctx.fillStyle = !theme ? "white" : "black";
//                 ctx.fillRect(0, 0, canvas.width, canvas.height);
//             }
//             }
//         }}
//         className="z-10 bg-blue-700 text-white"
//         variant="default"
//         color="black"
//         >
//         Theme
//         </Button>

//         <Group className="z-40 hover:shadow-slate-100">
//           {SWATCHES.map((swatch) => (
//             <ColorSwatch
//               key={swatch}
//               color={swatch}
//               onClick={() => setColor(swatch)}
//             />
//           ))}
//         </Group>
//         <Button
//           onClick={runRoute}
//           className="z-10 bg-blue-700 text-white"
//           variant="default"
//           color="white"
//         >
//           Answer
//         </Button>
//       </div>
//       <canvas
//         ref={canvasRef}
//         id="canvas"
//         className="absolute top-0 left-0 w-full h-full"
//         onMouseDown={startDrawing}
//         onMouseMove={draw}
//         onMouseUp={stopDrawing}
//         onMouseOut={stopDrawing}
//       />

//       {latexExpression &&
//         latexExpression.map((latex, index) => (
//           <Draggable
//             key={index}
//             defaultPosition={latexPosition}
//             onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
//           >
//             <div className="absolute p-2 bg-blue-600 text-white rounded shadow-md">
//               <div className="latex-content">{latex}</div>
//             </div>
//           </Draggable>
//         ))}
//     </>
//   );
// }



import { ColorSwatch, Group } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import Draggable from "react-draggable";
import { SWATCHES } from "../constants";

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rgb(255, 255, 255)");
  const [reset, setReset] = useState(false);
  const [penSize, setPenSize] = useState(1);
  const [isEraser, setIsEraser] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [result, setResult] = useState(null);
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
  const [latexExpression, setLatexExpression] = useState([]);

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexExpression([]);
      setResult(null);
      setDictOfVars({});
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
  
        // Set the default canvas background to black
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        ctx.lineCap = "round";
      }
    }
  
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
    script.async = true;
    document.head.appendChild(script);
  
    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
      });
    };
  
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  

  const renderLatexToCanvas = (expression, answer) => {
    const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
    setLatexExpression([...latexExpression, latex]);
  
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear the canvas and reset it to black background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        // Optionally, draw something or leave it as black
      }
    }
  };
  

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = isEraser ? "black" : color;
        ctx.lineWidth = penSize;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const runRoute = async () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const response = await axios.post(`https://ipad-calculator-ai.onrender.com/calculate`, {
        image: canvas.toDataURL("image/png"),
        dict_of_vars: dictOfVars,
      });

      const resp = await response.data;
      resp.data.forEach((data) => {
        if (data.assign === true) {
          setDictOfVars({
            ...dictOfVars,
            [data.expr]: data.result,
          });
        }
      });

      resp.data.forEach((data) => {
        setTimeout(() => {
          setResult({
            expression: data.expr,
            answer: data.result,
          });
        }, 1000);
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center p-2 bg-black">
        <button
          onClick={() => setReset(true)}
          className="z-10 p-2 rounded-xl h-16 w-40 text-2xl font-semibold bg-blue-700 text-black hover:cursor-pointer hover:bg-slate-100 hover:text-black"
        >
          Clear
        </button>

        
        <Group className="z-10 hover:cursor-pointer">
          {SWATCHES.map((swatch) => (
            <ColorSwatch
              key={swatch}
              color={swatch}
              onClick={() => {
                setColor(swatch);
                setIsEraser(false); // Disable eraser when a color is selected
              }}
            />
          ))}
        </Group>
        

        <div className="z-10 h-16 w-44 flex items-center space-x-2 bg-blue-700 p-2 rounded-xl">
  <div className="z-10 flex items-center justify-center h-10 w-10">
    <img
      src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTIgNTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTIgNDkuODI2bDE0LjUzOS0zLjU4M0w0My4zMzIgMTkuNDUgMzIuMzc2IDguNDk0IDUuNTg0IDM1LjI4N3oiLz48cGF0aCBkPSJNNDMuNTM4IDMuNDM4bDQuODUgNC44NWE0LjMxNyA0LjMxNyAwIDAgMSAwIDYuMTA2bC01LjA1NiA1LjA1NkwzMi4zNzYgOC40OTRsNS4wNTctNS4wNTZhNC4zMTcgNC4zMTcgMCAwIDEgNi4xMDUgMHoiLz48cGF0aCBkPSJNNS41ODQgMzUuMjg3bDEwLjk1NSAxMC45NTYiLz48cGF0aCBkPSJNMi4xMTYgNDkuODI2SDUwIi8+PC9nPjxtZXRhZGF0YT48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnJkZnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PHJkZjpEZXNjcmlwdGlvbiBhYm91dD0iaHR0cHM6Ly9pY29uc2NvdXQuY29tL2xlZ2FsI2xpY2Vuc2VzIiBkYzp0aXRsZT0icGVuY2lsLGVkaXQsd3JpdGUscGVuIiBkYzpkZXNjcmlwdGlvbj0icGVuY2lsLGVkaXQsd3JpdGUscGVuIiBkYzpwdWJsaXNoZXI9Ikljb25zY291dCIgZGM6ZGF0ZT0iMjAxNy0xMS0xMSIgZGM6Zm9ybWF0PSJpbWFnZS9zdmcreG1sIiBkYzpsYW5ndWFnZT0iZW4iPjxkYzpjcmVhdG9yPjxyZGY6QmFnPjxyZGY6bGk+RGlub3NvZnQgTGFiczwvcmRmOmxpPjwvcmRmOkJhZz48L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PC9zdmc+"
      alt="Pen"
      className="w-6 h-6"
    />
  </div>
  <input
    type="range"
    min="1"
    max="10"
    value={penSize}
    onChange={(e) => setPenSize(e.target.value)}
    className="flex-1 h-2 from-blue-100 rounded-full cursor-pointer"
  />
</div>

        <button
          onClick={() => setIsEraser((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl h-16 px-4 py-2 z-10 bg-blue-700 m-1 hover:bg-white"
        >
          <img
            src={
              isEraser
                ? "data:image/svg+xml;utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYuMDAxIDI1NiI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIGZpbGw9Im5vbmUiLz48bGluZSB4MT0iOTEuNTUiIHgyPSIxNTkuNDMyIiB5MT0iOTkuNTQ5IiB5Mj0iMTY3LjQzMSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iOCIvPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjgiIGQ9Ik0yMTYuMDAwNDksMjE1LjgzMzQ4SDcyLjA3TDM0Ljk4MTY0LDE3OC43NDUxN2ExNiwxNiwwLDAsMSwwLTIyLjYyNzQyTDE0OC4xMTg3Myw0Mi45ODA2NmExNiwxNiwwLDAsMSwyMi42Mjc0MSwwTDIxNi4wMDEsODguMjM1NWExNiwxNiwwLDAsMSwwLDIyLjYyNzQyTDExMS4wMzA0MiwyMTUuODMzNDciLz48L3N2Zz4="
                : "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTIgNTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTIgNDkuODI2bDE0LjUzOS0zLjU4M0w0My4zMzIgMTkuNDUgMzIuMzc2IDguNDk0IDUuNTg0IDM1LjI4N3oiLz48cGF0aCBkPSJNNDMuNTM4IDMuNDM4bDQuODUgNC44NWE0LjMxNyA0LjMxNyAwIDAgMSAwIDYuMTA2bC01LjA1NiA1LjA1NkwzMi4zNzYgOC40OTRsNS4wNTctNS4wNTZhNC4zMTcgNC4zMTcgMCAwIDEgNi4xMDUgMHoiLz48cGF0aCBkPSJNNS41ODQgMzUuMjg3bDEwLjk1NSAxMC45NTYiLz48cGF0aCBkPSJNMi4xMTYgNDkuODI2SDUwIi8+PC9nPjxtZXRhZGF0YT48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnJkZnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PHJkZjpEZXNjcmlwdGlvbiBhYm91dD0iaHR0cHM6Ly9pY29uc2NvdXQuY29tL2xlZ2FsI2xpY2Vuc2VzIiBkYzp0aXRsZT0icGVuY2lsLGVkaXQsd3JpdGUscGVuIiBkYzpkZXNjcmlwdGlvbj0icGVuY2lsLGVkaXQsd3JpdGUscGVuIiBkYzpwdWJsaXNoZXI9Ikljb25zY291dCIgZGM6ZGF0ZT0iMjAxNy0xMS0xMSIgZGM6Zm9ybWF0PSJpbWFnZS9zdmcreG1sIiBkYzpsYW5ndWFnZT0iZW4iPjxkYzpjcmVhdG9yPjxyZGY6QmFnPjxyZGY6bGk+RGlub3NvZnQgTGFiczwvcmRmOmxpPjwvcmRmOkJhZz48L2RjOmNyZWF0b3I+PC9yZGY6RGVzY3JpcHRpb24+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PC9zdmc+"
            }
            alt={isEraser ? "Eraser" : "Pen"}
            className="h-9"
          />
        </button>

        <button
          onClick={runRoute}
          className="z-10 p-2 m-1 rounded-xl font-semibold text-2xl h-16 w-36 bg-blue-700 text-black hover:cursor-pointer hover:bg-slate-100 hover:text-black"
        >
          Answer
        </button>
      </div>

      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />

{latexExpression &&
  latexExpression.map((latex, index) => (
    <Draggable
      key={index}
      defaultPosition={latexPosition}
      onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
    >
      <div
        className="absolute p-2 text-white rounded shadow-md"
        style={{ backgroundColor: "black" }} // Black background for the answer
      >
        <div className="absolute answer-board">{latex}</div>
      </div>
    </Draggable>
  ))}


    </>
  );
}
