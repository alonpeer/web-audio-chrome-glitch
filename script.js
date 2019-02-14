(function() {
  const enableWebAudio = window.location.search.indexOf('web-audio') >= 0

  document.getElementById("start").addEventListener("click", () => {
    if (context) {
      context.resume()
    }
    go()
  })

  const audio = document.getElementById("audio")
  let context = null

  if (enableWebAudio) {
    console.log("Using web audio")
    context = new AudioContext()
    const sourceNode = context.createMediaElementSource(audio)
    sourceNode.connect(context.destination)
  }
  else {
    console.log("Not using web audio")
  }

  let useMp3 = false

  const sourceTag = document.getElementById("source")

  function go() {
    audio.removeAttribute('src')

    const mse = new MediaSource()
    const url = URL.createObjectURL(mse)
    audio.load()
    audio.src = url
    audio.play()

    mse.addEventListener('sourceopen', () => {
      const buffer = mse.addSourceBuffer(useMp3 ? 'audio/mpeg' : 'audio/mp4; codecs="mp4a.40.2"')
      buffer.mode = 'sequence'
      const audioFile = useMp3 ? 'silence.mp3' : 'sine.mp4'
      sourceTag.textContent = useMp3 ? 'MP3' : 'AAC'
      useMp3 = !useMp3
      const request = new Request(audioFile)
      fetch(request).then((response) => {
        return response.arrayBuffer()
      }).then((data) => {
        buffer.appendBuffer(data)
      }).catch(console.error)
    });
  }
})()
