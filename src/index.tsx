import React from "react"
import ReactDOM from "react-dom"

export const YOUR_ATTRIBUTE = process.env.HOST

const createEntryDiv = () => {
   const elem = document.createElement("div")
   elem.id = "zestyexplorer"
   document.body.appendChild(elem)
}
const App = () => {
   console.log(YOUR_ATTRIBUTE)
   return (
      <div>
         <h1>My React and TypeScript App! </h1>
      </div>
   )
}

export const init = () => {
   createEntryDiv()

   ReactDOM.render(<App />, document.getElementById("zestyexplorer"))
}

init()
