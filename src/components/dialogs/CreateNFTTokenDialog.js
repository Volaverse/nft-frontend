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

export default function CreateNFTTokenDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const classes = useStyles();
  const [data, setData] = useState({
    name: "",
    description: "",
    initValue: "",
    minPurchaseMargin: "",
    fee: "",
    passphrase: "",
    category:1,
    imageUrl:"just_a_url@image.com",
    x:"",
    y:"",
    threeDUrl:"",
    area:"",
    landmark:"",
    type:"",
    bodypart:"",
    gender:"",
    serialNo:"",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
    console.log(event.target.name+" "+event.target.value);
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await createNFTToken({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
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
              value={data.threeDUrl}
              name="threeDUrl"
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
