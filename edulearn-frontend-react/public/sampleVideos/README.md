# Sample lesson videos

These are the three animated Class 6 Science lectures the homepage plays in its
"See it for yourself" section (`#samples`).

**Everything in this folder ships to production.** Vite copies `public/`
into `dist/` verbatim, so an unused file here is a file every deploy carries.
The camera-original masters therefore live outside `public/`, at:

    edulearn-frontend-react/media-src/sampleVideos-originals/

|                          | files | size |
|--------------------------|-------|------|
| originals (`media-src/`) | 3 mp4 | **402 MB** |
| this folder (ships)      | 3 mp4 + 3 jpg | **61 MB** |

The originals are 1280×720 H.264 at 5.7–7.0 Mbps. For animation at this size
that is roughly 4× more bitrate than the picture needs; the re-encode below
measures **SSIM 0.99** against the source and is visually indistinguishable.

## Replacing or adding a lesson

```sh
ffmpeg -i media-src/sampleVideos-originals/INPUT.mp4 \
  -c:v libx264 -profile:v high -preset slow -crf 26 -pix_fmt yuv420p \
  -vf scale=1280:720 \
  -c:a aac -b:a 96k -ac 2 \
  -movflags +faststart \
  public/sampleVideos/N.mp4
```

`-movflags +faststart` matters: it moves the moov atom to the front of the
file so the browser can start playing before the download finishes. Without
it a 20 MB lecture waits for all 20 MB.

Then a poster frame, pick a moment that reads well as a still. All three of
these use each video's own title card, about a second in:

```sh
ffmpeg -ss 1 -i public/sampleVideos/N.mp4 -frames:v 1 -q:v 4 public/sampleVideos/N.jpg
```

## Wiring

`public/ui/kid-home.js` → the `SAMPLES` array. Each entry's `f` is the filename
stem, so `{ f: '2' }` resolves to `/sampleVideos/2.mp4` and `/sampleVideos/2.jpg`.

The page never creates a `<video>` element until the visitor clicks a poster,
so scrolling past the section costs three ~90 KB JPEGs and nothing else. Keep
it that way, a `<video>` with a `src`, even hidden, still opens a connection.
