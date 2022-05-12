import { dummydata } from "constants/index"
import * as helper from "utils/index"
import React from "react"
import { useFetchWrapper } from "hooks"
import { fetchData } from "services"
import { Box, Button } from "@mui/material"
import { Loader } from "components"
import { containerStyle, loginPromp } from "./styles"
import { Headers } from "components"
import { TabContainer } from "components"
import { tabList } from "constants/index"
import { ContentViewer, JsonDataViewer, MetaViewer } from "views"

export const ZestyExplorerBrowser = ({
   pageData,
   response,
   contentData,
   children,
   jsonData,
}: any) => {
   const content = contentData || dummydata
   const [currentTab, setcurrentTab] = React.useState("Content Viewer")
   const [search, setSearch] = React.useState()
   // this is the data for editing request
   const [metaData, setMetaData] = React.useState([])
   // for loading of tabs
   const [time, settime] = React.useState(0)
   const userAppSID = helper.getCookie("APP_SID")
   const token = userAppSID
   const itemZUID = jsonData?.data?.meta?.zuid
   const modelZUID = jsonData?.data?.meta?.model?.zuid
   const instanceZUID = helper.headerZUID(jsonData.res)

   console.log(jsonData, "jsondata")
   // get the instance view models  on initial load
   const { loading, verifyFailed, verifySuccess, instances, views, models } =
      useFetchWrapper(userAppSID, instanceZUID)

   const url = `https://${instanceZUID}.api.zesty.io/v1/content/models/${modelZUID}/items/${itemZUID}`

   // this is for json data viewer
   const data = helper.transformContent(content, search)
   console.log(pageData, url, "This the Pagedata")

   const getFinalData = async () => {
      await fetchData(url, setMetaData, token)
   }
   React.useEffect(() => {
      console.log(instances, views, models, jsonData, "datas")
   }, [instances, models, views, jsonData])

   React.useEffect(() => {
      getFinalData()
   }, [])

   // for loading of tabs
   React.useEffect(() => {
      const timer = setTimeout(() => {
         if (time > 0) {
            settime(time - 1)
         }
      }, 1000)

      return () => clearTimeout(timer)
   })
   // show loading
   if (loading && !verifyFailed && !verifySuccess) {
      return (
         <Box sx={loginPromp}>
            <Loader />
         </Box>
      )
   }

   // show failed login prompt
   if (!verifySuccess) {
      return (
         <Box sx={loginPromp}>
            <h1>Please Login</h1>
            <Button
               href={`https://accounts.zesty.io/login`}
               variant="contained"
               color="secondary"
               size="small"
            >
               Sign in to Zesty.io
            </Button>
         </Box>
      )
   }

   return (
      <Box sx={containerStyle}>
         <Headers content={content} response={response}>
            {children}
         </Headers>
         <TabContainer
            setcurrentTab={setcurrentTab}
            tabList={tabList}
            settime={() => settime(2)}
         />
         <div style={{ position: "relative" }}>
            {time > 0 && <Loader />}
            {currentTab === "Content Viewer" && (
               <ContentViewer
                  metaData={metaData}
                  data={data}
                  search={search}
                  setSearch={setSearch}
                  url={url}
                  token={token}
               />
            )}
            {currentTab === "Meta Viewer" && (
               <MetaViewer response={response} content={contentData} />
            )}
            {currentTab === "Json Data Viewer" && (
               <JsonDataViewer data={data} search={search} setSearch={setSearch} />
            )}
         </div>
      </Box>
   )
}