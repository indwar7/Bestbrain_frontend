/* ============================================================
   BestBrain - LiveKit live-video glue
   Connects the live classroom to a real LiveKit room.
   - Fetches an eligibility-checked token from the backend
   - Teacher (host) publishes camera + mic
   - Students (viewer) subscribe and watch
   Attention monitoring (Socket.IO) runs separately, no conflict.
   Exposes window.EduLive.{connect, disconnect}.
   ============================================================ */
(function (global) {
  // Prefer api.js's resolved base, it already handles the https→proxy switch
  // and ignores stale plain-http overrides that the raw localStorage read here
  // used to honour (breaking live video on the deployed site the same way the
  // Arena broke).
  var API = (global.EduAPI && global.EduAPI.API_BASE) ||
    localStorage.getItem('edulearn_api') || '/backend-api';
  var room = null;

  function setStatus(msg) {
    var el = document.getElementById('lkStatus');
    if (el) el.textContent = msg;
  }
  function showStage(on) {
    var lk = document.getElementById('lkStage');
    var sim = document.getElementById('simAvatar');
    if (lk) lk.style.display = on ? 'block' : 'none';
    if (sim) sim.style.display = 'none';
    // When live video ends/fails, fall back to the formula board (not the avatar).
    if (!on) { var b = document.getElementById('boardStage'); if (b) b.style.display = 'block'; }
  }

  // Hide the formula board once REAL video is actually on screen (a track
  // attached), so a mere connect with no video keeps the board visible.
  function hideBoard() {
    var b = document.getElementById('boardStage');
    if (b) b.style.display = 'none';
  }

  // Connect to the LiveKit room for a backend live-session id.
  async function connect(sessionId) {
    if (!global.LivekitClient) {
      showStage(false);
      setStatus('Live video library not loaded.');
      return false;
    }
    if (!global.EduAPI || !EduAPI.getToken()) {
      showStage(false);
      setStatus('Please log in to join the video.');
      return false;
    }

    showStage(true);
    setStatus('Connecting to live video…');

    // 1. Get an eligibility-checked token from our backend.
    var data;
    try {
      var res = await fetch(API + '/api/live/' + sessionId + '/token', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + EduAPI.getToken() },
        credentials: 'include'
      });
      data = await res.json();
      if (!res.ok) {
        // 503 = LiveKit not configured yet; 403 = not eligible.
        setStatus(data.error || 'Could not get video access.');
        showStage(false);
        return false;
      }
    } catch (e) {
      setStatus('Cannot reach server for video token.');
      showStage(false);
      return false;
    }

    // This class is running on the Google Meet fallback (no LiveKit token) ,
    // point the user at the Meet link instead of connecting a room here.
    if (data.videoProvider === 'google-meet') {
      showStage(false);
      setStatus('This class is on Google Meet, use the "Join Google Meet" button above.');
      return { meetLink: data.videoRoom };
    }

    // 2. Connect to the LiveKit room.
    var LK = global.LivekitClient;
    room = new LK.Room({ adaptiveStream: true, dynacast: true });

    var mainVideo = document.getElementById('lkMainVideo');

    // When a remote track arrives (e.g. teacher's camera for a student), show it.
    room.on(LK.RoomEvent.TrackSubscribed, function (track) {
      if (track.kind === 'video' && mainVideo) { track.attach(mainVideo); hideBoard(); }
      if (track.kind === 'audio') track.attach();
    });
    room.on(LK.RoomEvent.Disconnected, function () { setStatus('Disconnected from live video.'); });
    room.on(LK.RoomEvent.ParticipantConnected, function () { updateCount(); });
    room.on(LK.RoomEvent.ParticipantDisconnected, function () { updateCount(); });

    function updateCount() {
      var n = room.numParticipants + 1;
      setStatus(data.role === 'host' ? ('You are live · ' + n + ' in room') : ('Watching · ' + n + ' in room'));
    }

    try {
      await room.connect(data.url, data.token);
    } catch (e) {
      setStatus('Failed to connect: ' + e.message);
      showStage(false);
      return false;
    }

    // 3. Host (teacher) publishes their camera + mic. Viewer just watches.
    if (data.role === 'host') {
      try {
        await room.localParticipant.enableCameraAndMicrophone();
        var camPub = room.localParticipant.getTrackPublication(LK.Track.Source.Camera);
        if (camPub && camPub.track && mainVideo) { camPub.track.attach(mainVideo); hideBoard(); }
        setStatus('You are live (teacher) · streaming to your class');
      } catch (e) {
        setStatus('Camera/mic blocked. Allow access to stream.');
      }
    } else {
      setStatus('Connected · waiting for the teacher’s video…');
    }
    updateCount();
    return true;
  }

  async function disconnect() {
    if (room) { try { await room.disconnect(); } catch (e) {} room = null; }
    showStage(false);
  }

  global.EduLive = { connect: connect, disconnect: disconnect };
})(window);
