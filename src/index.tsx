import React from "react"
import ReactDOM from "react-dom"
import { ZestyExplorer } from "./components"
import { canUseDOM } from "./utils/index"

export const YOUR_ATTRIBUTE = process.env.HOST

// const createEntryDiv = () => {
//    const elem = document.createElement("div")
//    elem.id = "zestyexplorer"
//    document.body.appendChild(elem)
// }
// const App = () => {
//    return (
//       <div>
//          <h1>My React and TypeScript App! </h1>
//       </div>
//    )
// }

// export const init = () => {
//    createEntryDiv()

//    ReactDOM.render(<App />, document.getElementById("zestyexplorer"))
// }

// init()

console.log(YOUR_ATTRIBUTE)
const main = () => {
   if (!canUseDOM()) {
      return null
   }
   document.body.innerHTML += '<div id="zesty-explorer"></div>'
   ReactDOM.render(<ZestyExplorer />, document.getElementById("zesty-explorer"))
}
main()
