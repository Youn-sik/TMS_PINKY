import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'
import axios from 'axios';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const base_url = "http://"+window.location.href.split('/')[2]+":3000"
export default class Stream extends React.Component {
  state = {
    preStream:"",
  }

  componentDidMount() {
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  async componentDidUpdate() {
    if(this.state.preStream !== this.props.stream) { //2번 실행 방지
      this.setState({
        preStream : this.props.stream
      });
      // try{
        let result = await axios.post(base_url+':4000/start',{
          "uri" : "rtsp://"+this.props.stream+":9096",
          account : this.props.user_id,
        })
        if(result.data.error) {
          throw result.data.error
        }
        setTimeout(() =>{
          this.player.src('http://172.16.135.89:4000/stream/'+result.data.id+'/'+result.data.id+'.m3u8');
          this.player.play();
        },5000)
        this.props.setStreamId(result.data.id);
      // } 
      // catch(e) {
      //   this.player.createModal('스트리밍 연결 실패!');
      //   this.player.src('./sample.m3u8');
      //   this.player.pause();
      // }
    }
  }

  render() {
    return (
      // <Card style={{padding:20}}>
      //   <CardHeader>스트리밍</CardHeader>
      //   
      // </Card>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>스트리밍</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <video style={{width:"100%",height:"700px"}} ref={node => (this.videoNode = node)} className="video-js" />
        </AccordionDetails>
      </Accordion>
    );
  }
}