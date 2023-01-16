import "./style.css";
import { useEffect, useState } from "react";
import { PdfViewer } from "./PdfViewer";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { excelConvert, exportToJson, pdfConvert } from "./utill";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import { BlobServiceClient } from "@azure/storage-blob";
import {
  containerName,
  isStorageConfigured,
  sasToken,
} from "../UploadDocument/util";
import { baseURL, fileName } from "./Constant";
import { arrayOfdata } from "./mockData";

const storageConfigured = isStorageConfigured();

const CheckResults = ({ selectedInfo }) => {
  const [fieldValue, setFieldValue] = useState("");
  const [info, setInfo] = useState([]);
  const [waitingLoader, setWatingLoader] = useState(true);

  useEffect(() => {
    console.log("storageConfigured", storageConfigured);
    if (storageConfigured) {
      uploadFileToBlob(selectedInfo.uploaded_file[0]);
    }
  }, []);

  const apiCalling = async (fileURL) => {
    console.log("fileUrl", fileURL);
    axios({
      url: baseURL,
      method: "POST",
      headers: {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      },
      // data: { name: selectedInfo.uploaded_file[0].name },
      data: { fileURL: fileURL },
    })
      .then((res) => {
        console.log("data", res);
       
        if(selectedInfo.document_types === 'Title contracts'){
        arrayOfdata.map((arr) => {
          for (let key in res.data) {
            if (res.data.hasOwnProperty(key) && arr.name === key) {
              arr.value = res.data[key];
            }
          }
        });
        setInfo(arrayOfdata);
      }
      else {
        const tempArray = [];
                let tempObj = {};
                for (let key in res.data) {
                  if (res.data.hasOwnProperty(key)) {
                    tempObj = {
                      name: key,
                      value: res.data[key],
                    };
                    tempArray.push(tempObj);
                  }
                }
                setInfo(tempArray);
      }
        console.log('kk',selectedInfo.document_types);

        // if (selectedInfo.data_points === "All data points") {
        // } else {
        //   let res = arrayOfdata.filter((n) =>
        //     selectedInfo.customDataArray.some((n2) => n.name === n2.name)
        //   );
        //   setInfo(res);
        // }
        setWatingLoader(false);
      })

      // Catch errors if any
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleEdit = (index, key, value) => {
    // let i = 0;
    // for (let _ of info) {
    //   document.getElementById("span_" + i).classList.remove("d-none");
    //   document.getElementById("input_" + i).classList.add("d-none");
    //   document.getElementById("save_" + i).classList.add("d-none");
    //   document.getElementById("cancel_" + i).classList.add("d-none");
    //   document.getElementById("edit_" + i).classList.remove("d-none");
    //   i++;
    // }
    for (let i = 0; i < info.length; i++) {
      document.getElementById("span_" + i).classList.remove("d-none");
      document.getElementById("input_" + i).classList.add("d-none");
      document.getElementById("save_" + i).classList.add("d-none");
      document.getElementById("cancel_" + i).classList.add("d-none");
      document.getElementById("edit_" + i).classList.remove("d-none");
    }
    setFieldValue(value);
    document.getElementById("input_" + index).value = value;
    document.getElementById("span_" + index).classList.add("d-none");
    document.getElementById("input_" + index).classList.remove("d-none");
    document.getElementById("save_" + index).classList.remove("d-none");
    document.getElementById("cancel_" + index).classList.remove("d-none");
    document.getElementById("edit_" + index).classList.add("d-none");
  };

  const handleSave = (i, key, value) => {
    document.getElementById("span_" + i).innerHTML = fieldValue;
    document.getElementById("span_" + i).classList.remove("d-none");
    document.getElementById("input_" + i).classList.add("d-none");
    document.getElementById("save_" + i).classList.add("d-none");
    document.getElementById("cancel_" + i).classList.add("d-none");
    document.getElementById("edit_" + i).classList.remove("d-none");
    let updatedValue = info.map((ele) =>
      ele.name === key ? { ...ele, value: fieldValue } : ele
    );
    setInfo(updatedValue);
  };
  const handleClose = (index, key, value) => {
    document.getElementById("span_" + index).classList.remove("d-none");
    document.getElementById("input_" + index).classList.add("d-none");
    document.getElementById("save_" + index).classList.add("d-none");
    document.getElementById("cancel_" + index).classList.add("d-none");
    document.getElementById("edit_" + index).classList.remove("d-none");
  };

  const handleUpdateFieldValue = (value, index) => {
    setFieldValue(value);
  };

  const onExportDataPdf = () => {
    let arr = [];
    for (const element of info) {
      arr.push([element.name, element.value]);
    }
    console.log(arr);
    pdfConvert(arr, selectedInfo.uploaded_file[0].name).save(
      `${selectedInfo.uploaded_file[0].name}.pdf`
    );
  };

  const onExportDataExcel = () => {
    saveAs(excelConvert(info), `${selectedInfo.uploaded_file[0].name}.xlsx`);
  };
  const headers = [
    { label: "Field Name", key: "name" },
    { label: "Value", key: "value" },
  ];
  const csvReport = {
    data: info,
    headers: headers,
    filename: `${selectedInfo.uploaded_file[0].name}.csv`,
  };

  const onExportDataJSON = () => {
    exportToJson(info, selectedInfo.uploaded_file[0].name);
  };

  const onExportDataText = () => {
    const str = info.map((a) => `${Object.values(a).join(": ")}\n`).join("");
    let blob = new Blob([str], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${selectedInfo.uploaded_file[0].name}.txt`);
  };

  // azure file uploading

  // <snippet_uploadFileToBlob>
  const uploadFileToBlob = async (file) => {
    if (!file) return [];
    console.log("file", file);
    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(
      `https://rg01deva5c0.blob.core.windows.net/?${sasToken}`
    );
    // `https://rg01deva5c0.blob.core.windows.net/?${sasToken}`
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName);
    await containerClient.createIfNotExists({
      access: "container",
    });

    // upload file

    const blobClient = containerClient.getBlockBlobClient(file.name);

    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.type } };

    // upload file
    await blobClient
      .uploadData(file, options)
      .then((res) => {
        console.log("Done=>>>", res._response.request.url);
        apiCalling(res._response.request.url);
      })
      .catch((ex) => console.log("error", ex.message));
  };
  // </snippet_uploadFileToBlob>

  return (
    <div className="check-result-container">
      <div className="check-result-header">
        <h5>Check Result</h5>
      </div>
      {waitingLoader ? (
        <div className="wating-container">
          {/* <img className="waiting-img" src={waiting} alt="loading..." /> */}
          <Spinner animation="border" />
          Please Wait.... Your file(s) are being processed......
        </div>
      ) : (
        <div className="row">
          <div className="col-md-4">
            <div>
              <PdfViewer preview={selectedInfo.uploaded_file[0]} />
            </div>
          </div>
          <div className="col-md-8">
            <div className="check-result-container-right">
              <ul>
                {info.map((data, index) => {
                  return (
                    <li key={index}>
                      <div className="left-title-section">
                        <label className="heading-title">{data.name}</label>
                      </div>
                      <div className="value-section ">
                        <label id={"span_" + index}>{data.value}</label>
                        <input
                          type="text"
                          className="form-control d-none"
                          id={"input_" + index}
                          onChange={(e) =>
                            handleUpdateFieldValue(e.target.value, index)
                          }
                        />
                      </div>
                      <div>
                        <i
                          id={"edit_" + index}
                          className="fa fa-edit c-pointer"
                          aria-hidden="true"
                          onClick={() =>
                            handleEdit(index, data.name, data.value)
                          }
                        ></i>
                        <i
                          id={"save_" + index}
                          className="fa fa fa-check d-none c-pointer"
                          aria-hidden="true"
                          onClick={() =>
                            handleSave(index, data.name, data.value)
                          }
                        ></i>
                        <i
                          id={"cancel_" + index}
                          className="fa fa-times d-none c-pointer"
                          aria-hidden="true"
                          onClick={() =>
                            handleClose(index, data.name, data.value)
                          }
                        ></i>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* <div className="save-btn-checkresults">
              <button
                  className="btn btn-common"
                  variant="secondary"
                  onClick={onSaveBtnClick}
                >
                  Save
                </button>
                </div> */}
              <div className="export-btn-container">
                <button
                  className="btn btn-common"
                  variant="secondary"
                  onClick={onExportDataPdf}
                >
                  Export Data as a PDF
                </button>
                <button
                  className="btn btn-common"
                  variant="secondary"
                  onClick={onExportDataExcel}
                >
                  Export Data to excel
                </button>
                <button
                  className="btn btn-common"
                  variant="secondary"
                  onClick={onExportDataJSON}
                >
                  Export Data to JSON
                </button>
                <button
                  className="btn btn-common"
                  variant="secondary"
                  onClick={onExportDataText}
                >
                  Export Data to Text File
                </button>
                <CSVLink className="btn btn-common" {...csvReport}>
                  Export to CSV
                </CSVLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckResults;
