import * as React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

export default function OutlinedCard({ handleCustomDomain }: any) {
   const card = (
      <React.Fragment>
         <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
               Domain Not Valid
            </Typography>
            <Typography variant="h5" component="div">
               Enter Domain
            </Typography>
         </CardContent>
         <CardActions>
            <Button size="small" onClick={handleCustomDomain}>
               Save
            </Button>
            <Button
               size="small"
               onClick={() => {
                  window.location.reload()
               }}
            >
               Close
            </Button>
         </CardActions>
      </React.Fragment>
   )
   return (
      <Box sx={{ minWidth: 275 }}>
         <Card variant="outlined">{card}</Card>
      </Box>
   )
}
