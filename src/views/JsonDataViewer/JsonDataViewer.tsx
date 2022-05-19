import React from "react"
import ReactJson from "react-json-view-ssr"
import { SearchAppBar, Subheaders } from "components"
import { Box, Fab, Zoom } from "@mui/material"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
interface Props {
   search: any
   data: any
   setSearch: (e: any) => void
   theme: any
   content: any
}

export const JsonDataViewer = ({ content, data, search, setSearch, theme }: Props) => {
   console.log(data, "data123123")
   // const [currentScroll, setcurrentScroll] = React.useState(0)

   // const scrollEvent = (e: any) => {
   //    const target = e.target as HTMLTextAreaElement
   //    setcurrentScroll(target.scrollTop)
   //    console.log("Current scroll position:", target.scrollTop)
   // }
   return (
      <Box sx={{ background: "#fff" }}>
         <Subheaders content={content} theme={theme} />
         <SearchAppBar value={search} onChange={setSearch} />
         <Box sx={{ position: "relative", height: "50vh" }}>
            <Zoom in={true}>
               <Fab
                  sx={{ position: "absolute", bottom: "0", right: "0" }}
                  color="secondary"
                  size="small"
                  aria-label="gotoTop"
                  href="#gotoTop"
               >
                  <KeyboardArrowUpIcon />
               </Fab>
            </Zoom>
            <ReactJson
               style={{ height: "80vh", overflowY: "scroll" }}
               name={"data"}
               // @ts-ignore
               src={data}
               theme="flat"
               iconStyle="square"
               indentWidth={4}
               collapsed={2}
               displayObjectSize
               displayDataTypes={false}
               enableClipboard={true}
            />
         </Box>
      </Box>
   )
}
