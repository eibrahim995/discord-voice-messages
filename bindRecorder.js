const constraints = {
    audio: true,
    video: false
}
const setStatus = (recording, callable=null) => {
    const micBtn = document.getElementById('record-btn');
    const micIcon = document.getElementById('record-icon');
    micBtn.removeEventListener("click", callable);
    if (recording){
        micIcon.style.color = "#09e38a";
    }
    else{
        micIcon.style.color = "white";
        micBtn.addEventListener("click", startRecord);
    }
}
const startRecord = () => {
    var audioContext = window.AudioContext ? new window.AudioContext : new window.webkitAudioContext;
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        var recordedChunks = [];

        const options = {mimeType: "audio/webm; codecs=pcm"};
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            } else {
                // ...
            }
        };
        const micBtn = document.getElementById('record-btn');
        const stopRecording = () => {
            setStatus(false, stopRecording);
            mediaRecorder.stop();
        }
        micBtn.addEventListener("click", stopRecording);
        setStatus(true, startRecord);
        mediaRecorder.start(1000);


        const  download = (blob) => {
            let file = new File([blob], "record.wav",{type:"audio/wav", lastModified:new Date().getTime()});
            let upload_input = document.getElementsByClassName("file-input")[0];
            let container = new DataTransfer();
            container.items.add(file);
            upload_input.files = container.files;
            var event = document.createEvent("UIEvents");
            event.initUIEvent("change", true, true);
            upload_input.dispatchEvent(event)
        }
        mediaRecorder.onstop = () => {
            const blob = new Blob(
                recordedChunks,
                { type: mediaRecorder.mimeType }
            );
            const fileReader = new FileReader()
            fileReader.onloadend = () => {
                const arrayBuffer = fileReader.result;
                audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                    audioEncoder(audioBuffer, 32, () => {}, download);
                })
            }
            fileReader.readAsArrayBuffer(blob);
        }
    });

}

const addMicButton = () => {
    if (document.getElementById("record-btn")){
        document.getElementById("record-btn").remove();
    }
    let micBtn = document.createElement('span');
    let docsContainer = document.getElementsByClassName("file-input")[0].parentElement.parentElement;
    const micIcon = document.createElement('i');
    micIcon.classList.add("fa");
    micIcon.classList.add("fa-microphone");
    micIcon.style.lineHeight = "20px";
    micIcon.style.color = "white";
    micIcon.id = "record-icon";

    micBtn.style.height = "20px";
    micBtn.style.width = "20px";
    micBtn.style.zIndex = "999";
    micBtn.style.borderRadius = "50%";
    micBtn.style.position = "relative";
    micBtn.style.cursor = "pointer";
    micBtn.style.marginLeft = "10px";
    micBtn.style.webkitUserSelect = "none";
    micBtn.id = "record-btn";
    micBtn.append(micIcon)
    docsContainer.append(micBtn);
    docsContainer.style.alignItems = 'center';
    micBtn.addEventListener("click", startRecord);
}
domChangesHandler = () => {
    var oldHref = document.location.href;
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                /* Changed ! your code here */
                documentLoadedListener();
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };
    observer.observe(bodyList, config);
}
const documentLoadedListener = () => {
    const waitForIt = setInterval(() => {
        if (document.getElementsByClassName("file-input").length > 0){
            clearInterval(waitForIt);
            addMicButton();
        }
    }, 100);
}
window.addEventListener("load", documentLoadedListener);
domChangesHandler();