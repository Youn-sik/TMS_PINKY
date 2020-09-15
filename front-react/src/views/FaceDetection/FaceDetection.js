import React,{useState,useEffect} from 'react';
import ImageUploader from "react-images-upload";
import { Grid,Card,CardContent,TextField,Button,Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import './image.css'
import axios from 'axios';
// import '@tensorflow/tfjs-node';
// import * as faceapi from 'face-api.js';
const useStyles = makeStyles(theme => ({
    root:{
        padding: theme.spacing(4)
    }
}));

// Promise.all([
//     faceapi.nets.faceRecognitionNet.loadFromUri('../../../models'),
//     faceapi.nets.faceLandmark68Net.loadFromUri('../../../models'),
//     faceapi.nets.ssdMobilenetv1.loadFromUri('http://172.16.135.89:3000/face-models')
// ])

const FaceDetection = (props) => {
    const [pictures, setPictures] = useState([]);
    const [detectedUsers, setDetectedUsers] = useState([])
    const classes = useStyles();
    
    const onDrop = async  picture => {
        setPictures([picture,...pictures]);
        const fd = new FormData();
        fd.append('image', picture[0])
        let result = await axios.post('http://172.16.135.89:3000/face-detect',fd);
        let filteredData = result.data.filter(i => i._label !== 'unknown')
        let profiles = []
        if(filteredData.length > 0) {
            filteredData.map(i => profiles.push(i._label.split("|")));
            setDetectedUsers(profiles);
        } else {
            setDetectedUsers([]);
        }
    };

    return(
        <div className={classes.root}>
            <Grid
                container
                justify="center"
                alignItems="center"
                spacing={4}
            >
                <Grid
                item
                lg={12}
                md={12}
                xl={12}
                xs={12}
                >
                    <Card>
                        <ImageUploader
                        {...props}
                        withIcon={true}
                        withPreview={true}
                        onChange={onDrop}
                        imgExtension={[".jpg", ".png"]}
                        label="최대 크기 : 5mb, 허용 확장자: jpg|png"
                        fileSizeError="파일의 크기가 너무 큽니다."
                        fileTypeError="지원하지 않는 타입의 파일 입니다."
                        buttonText="프로필 사진 업로드"
                        maxFileSize={5242880}
                        singleImage={true}
                        />
                        {
                            detectedUsers.length > 0 ?
                            detectedUsers.map((user) => {
                                    return (
                                        <Grid
                                        container
                                        justify="center"
                                        alignItems="center"
                                        spacing={4}
                                        >
                                            <img style={{maxWidth:"30vw"}} src={user[8]}></img>
                                            <table class="type10">
                                                <thead>
                                                <tr> 
                                                    <th colspan="2">얼굴 인식 결과</th> 
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr> 
                                                    <th>이름</th> 
                                                    <td>{user[0]}</td> 
                                                </tr> 
                                                <tr class="even">
                                                    <th>성별</th> 
                                                    <td>{user[6] === "1" ? "남자" : "여자"}</td>
                                                </tr> 
                                                <tr>
                                                    <th>근무지</th> 
                                                    <td>{user[1]}</td>
                                                </tr> 
                                                <tr class="even"> 
                                                    <th>부서</th> 
                                                    <td>{user[2]}</td>
                                                </tr> 
                                                <tr>
                                                    <th>직급</th> 
                                                    <td>{user[3]}</td>
                                                </tr> 
                                                <tr class="even">
                                                    <th>휴대폰 번호</th> 
                                                    <td>{user[4]}</td>
                                                </tr> 
                                                <tr>
                                                    <th>이메일</th> 
                                                    <td>{user[5]}</td>
                                                </tr>
                                                <tr class="even">
                                                    <th>생성일</th> 
                                                    <td>{user[9]}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </Grid>
                                    )
                                }
                            ) : null
                        }
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default FaceDetection