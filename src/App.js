import mic from "./media/microphone-svgrepo-com.svg";
import "./App.css";
import {useState} from "react";
import audioEncoder from "audio-encoder"

const getMedia = (mediaFile) => {
  if (window.chrome && window.chrome.runtime) {
    return window.chrome.runtime.getURL(mediaFile);
  }
  return mediaFile;
}
const App = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [stopRecording, setStopRecording] = useState(() => () => {})

  const  download = (blob) => {
    const time = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "").replace(/ /, "_");
    let file = new File([blob], `Record_${time}.wav`,{type:"audio/wav", lastModified:new Date().getTime()});
    let upload_input = document.getElementsByClassName("file-input")[0];
    let container = new DataTransfer();
    container.items.add(file);
    upload_input.files = container.files;
    var event = document.createEvent("UIEvents");
    event.initUIEvent("change", true, true);
    upload_input.dispatchEvent(event)
  }
  const startRecording = () => {
    const audioContext = window.AudioContext ? new window.AudioContext : new window.webkitAudioContext;
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    }).then(function(stream) {
      let recordedChunks = [];
      const options = {mimeType: "audio/webm; codecs=pcm"};
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        } else {
          // ...
        }
      };
      setStopRecording(() => {
        return () => {
        mediaRecorder.stop();
        stream.getTracks()
            .forEach( track => track.stop() );
      }})
      mediaRecorder.start(1000);
      mediaRecorder.onstop = () => {
        const blob = new Blob(
            recordedChunks,
            { type: mediaRecorder.mimeType }
        );
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
          const arrayBuffer = fileReader.result;
          audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            audioEncoder(audioBuffer, "WAV", () => {}, download);
          })
        }
        fileReader.readAsArrayBuffer(blob);
      }
    });

  }
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording){
      stopRecording();
    }
    else {
      startRecording();
    }
  }
  return (
    <div className="Mic-Container">
      <span className="Miv-Btn" onClick={toggleRecording}>
        <img className={"Mic-Icon" + (isRecording ? " Mic-Icon-Active" : "")} src={getMedia(mic)}/>
      </span>
    </div>
  );
}

export default App;
