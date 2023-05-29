import React, { Fragment, useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NodeInfoContext } from "../../context";
import { createNFTToken } from "../../utils/transactions/create_nft_token";
import * as api from "../../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
}));
const timer = ms => new Promise(res => setTimeout(res, ms))

export default function CreateNFTsTokenDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const [data, setData] = useState({
    name: "",
    description: "",
    initValue: "",
    minPurchaseMargin: "",
    fee: "",
    passphrase: "",
    category:0,
    imageUrl:"just_a_url@image.com",
    x:"",
    y:"",
    threeD_url:"",
    area:"",
    landmark:"",
    type:"",
    bodypart:"",
    gender:"",
    serialNo:"",
    num:0,

  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
    console.log(event.target.name+" "+event.target.value);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const {num, ...params} = data;
    if(parseInt(num)>0){
      for (var i=0;i<num;i++){
        params.name= data.name +String(i+1);
        if(params.category==1 || params.category=="1" ){
          params.imageUrl = "https://store.volaverse.com/assets/wearables/"+String(i+1)+".png";
        }
        if(params.category==2 || params.category=="2" ){
          params.imageUrl = "https://store.volaverse.com/assets/collectibles/"+String(i+1)+".png";
        }
        const res = await createNFTToken({
          ...params,
          networkIdentifier: nodeInfo.networkIdentifier,
          minFeePerByte: nodeInfo.minFeePerByte,
        });
        const txnResp=await api.sendTransactions(res.tx);
        console.log(txnResp);
        await timer(10500);

      }
 
      
    }
 
    props.handleClose();
  };

  return (
    <Fragment>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle id="alert-dialog-title">{"Create NFT"}</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              label="Name"
              value={data.name}
              name="name"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description"
              value={data.description}
              name="description"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Initial Token value"
              value={data.initValue}
              name="initValue"
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Minimum Purchase Margin (0 - 100)"
              value={data.minPurchaseMargin}
              name="minPurchaseMargin"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Number of NFTs to be minted"
              value={data.num}
              name="num"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Fee"
              value={data.fee}
              name="fee"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Passphrase"
              value={data.passphrase}
              name="passphrase"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Category"
              value={data.category}
              name="category"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Image Url"
              value={data.imageUrl}
              name="imageUrl"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="X coordinate"
              value={data.x}
              name="x"
              onChange={handleChange}
              fullWidth
            />
           <TextField
              label="Y coordinate"
              value={data.y}
              name="y"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="threeD_url"
              value={data.threeD_url}
              name="threeD_url"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="area"
              value={data.area}
              name="area"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="landmark"
              value={data.landmark}
              name="landmark"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="type"
              value={data.type}
              name="type"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="bodypart"
              value={data.bodypart}
              name="bodypart"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="gender"
              value={data.gender}
              name="gender"
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="serialNo"
              value={data.serialNo}
              name="serialNo"
              onChange={handleChange}
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Create NFT</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
