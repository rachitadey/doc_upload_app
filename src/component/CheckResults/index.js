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
import { baseURL, fileName, saveToDBURL } from "./Constant";
import { arrayOfdata, mockData } from "./mockData";

import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const storageConfigured = isStorageConfigured();

const CheckResults = ({ selectedInfo }) => {
  const [fieldValue, setFieldValue] = useState("");
  const [info, setInfo] = useState([]);
  const [waitingLoader, setWatingLoader] = useState(true);
  const [markWords, setMarkWords] = useState([])
  
  const [uploadOrDownloadCount, setUploadOrDownloadCount] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');

  var interval = setInterval(function () {
    setPercentage(percentage + 10);
    if (percentage < 91) setUploadOrDownloadCount(percentage);
  }, 5000);
  setTimeout(function () {
    clearInterval(interval);
  }, 10000);


  useEffect(() => {
    // console.log("storageConfigured", storageConfigured);
    if (storageConfigured) {
      uploadFileToBlob(selectedInfo.uploaded_file[0]);
    } 
    nextBtn.style.display = "none";
    backBtn.style.display = "none";
  }, []);
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const apiCalling = async (fileURL) => {
    // console.log("fileUrl", fileURL);
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
      .then(async (res) => {
        setUploadOrDownloadCount(100);
            await delay(5000);
            nextBtn.style.display = "block";
            backBtn.style.display = "block";
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
                let arr = [];
                for (const element of tempArray) {
                  console.log(element.value);
                  if(element.value !== null && typeof element.value !== "number" 
                  && element.value !== "" && element.value !== '15' 
                  && element.value !== '0' && element.value !== '5' 
                  && element.value !== '7'
                  && !(element.value.toLowerCase() === 'na'|| element.value.toLowerCase() === 'no'|| element.value.toLowerCase() === 'yes' || element.value.toLowerCase() === 'of'))
                  {
                  arr.push(element.value);
                  }
                }
                setMarkWords(arr)
      // }
        // console.log('kk',selectedInfo.document_types);

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

//   const onSavetoDB = () => {
// console.log('info',info);
// const dataforSavetoDB = info.reduce((obj, cur, i) => ({ ...obj, [cur.name] : cur.value }), {})
// console.log('asddf', dataforSavetoDB);
// axios({
//   url: saveToDBURL,
//   method: "POST",
//   headers: {
//     Accept: "*/*",
//     "User-Agent": "Thunder Client (https://www.thunderclient.com)",
//     "Content-Type": "application/json",
//   },
//   // data: { name: selectedInfo.uploaded_file[0].name },
//   data: { jsonPayload: dataforSavetoDB },
// })
//   .then((res) => {
//     console.log("data", res);
   
//   })

//   // Catch errors if any
//   .catch((err) => {
//     console.log("err", err);
//   });

//   }

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
    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
    const blobService = new BlobServiceClient(
        `https://pdffileupload.blob.core.windows.net/?${sasToken}`
    );
    // `https://rg01deva5c0.blob.core.windows.net/?${sasToken}`
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(containerName);
    // await containerClient.createIfNotExists({
    //   access: "container",
    // });

    // upload file

    const blobClient = containerClient.getBlockBlobClient(file.name);

    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.type } };

    // upload file
    await blobClient
      .uploadData(file, options)
      .then((res) => {
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
          Please Wait.... Your file(s) are being processed......
          <div style={{ width: 200, height: 200,paddingTop:10 }}>
            <CircularProgressbarWithChildren value={uploadOrDownloadCount} styles={buildStyles({pathColor: '#73bf45'})}>
              <div style={{ fontSize: 12, marginTop: -5 }}>
                <strong>{uploadOrDownloadCount} %</strong>
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-7">
            <div>
              <PdfViewer preview={selectedInfo.uploaded_file[0]} markWords={markWords}/>
            </div>
          </div>
          <div className="col-md-5">
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
