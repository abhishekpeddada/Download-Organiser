chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  let filename = item.filename;
  let extension = filename.split('.').pop().toLowerCase();
  let folder = '';

  if (['doc', 'docx', 'pdf', 'txt'].includes(extension)) {
    folder = 'Documents';
  } else if (['mp4', 'avi', 'mkv'].includes(extension)) {
    folder = 'Videos';
  } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    folder = 'Images';
  } else {
    folder = 'Others';
  }

  // Suggest the new filename with the folder path
  suggest({ filename: folder + '/' + filename });

  // Create the folder if it doesn't exist
  chrome.downloads.onChanged.addListener((delta) => {
    if (delta.state && delta.state.current === 'complete') {
      let downloadId = delta.id;
      chrome.downloads.search({ id: downloadId }, (results) => {
        if (results.length > 0) {
          let downloadItem = results[0];
          let filePath = downloadItem.filename;
          let folderPath = filePath.substring(0, filePath.lastIndexOf('/'));

          // Use the file system API to create the folder
          chrome.fileSystem.getWritableEntry(folderPath, (entry) => {
            if (!entry) {
              chrome.fileSystem.getDirectoryEntry(folderPath, { create: true }, () => {
                console.log('Folder created:', folderPath);
              });
            }
          });
        }
      });
    }
  });
});
