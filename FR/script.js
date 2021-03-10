const video = document.getElementById('video')
var mods='/FR/models';
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(mods),
  faceapi.nets.faceLandmark68Net.loadFromUri(mods),
  faceapi.nets.faceRecognitionNet.loadFromUri(mods),
  faceapi.nets.faceExpressionNet.loadFromUri(mods),
faceapi.nets.ssdMobilenetv1.loadFromUri(mods)

]).then(startVideo)

async function startVideo() {
const labeledFaceDescriptors =  await loadLabeledImages()
const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)


  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
 

  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptor()
    //console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
   console.log(resizedDetections);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)


const results = faceMatcher.findBestMatch(detections.descriptor)

//const results = resizedDetections.map(d => {
 // return faceMatcher.findBestMatch(d.descriptor)
 // })
const box = resizedDetections.detection.box
const drawBox = new faceapi.draw.DrawBox(box, { label: results.label.toString() })
      drawBox.draw(canvas)

//console.log(results);
 //results.forEach((result, i) => {
   //   console.log(result);
   //   const box = resizedDetections[i].detection.box
    //  const drawBox = new faceapi.draw.DrawBox(box, { label: result.label.toString() })
     // drawBox.draw(canvas)
    //})



  }, 100)
})

}



function loadLabeledImages() {
  const labels = ['Ant Man','Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 2; i++) {
        //const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
        const img = await faceapi.fetchImage(`https://espinojim2.github.io/FR/labeled_images/${label}/${i}.jpg`)


        

        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}