import React from "react"
import ReactDOM from "react-dom"
import { ZestyExplorer } from "./components"
import { canUseDOM } from "./utils/index"

console.log(process.env.DOMAIN_OVERRIDE, "DOMAIN")
export const main = () => {
   if (!canUseDOM()) {
      return null
   }
   document.body.innerHTML += '<div id="zesty-explorer"></div>'
   ReactDOM.render(<ZestyExplorer />, document.getElementById("zesty-explorer"))
}
main()
