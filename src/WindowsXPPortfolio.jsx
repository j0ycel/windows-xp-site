import React, { useState, useEffect, useRef } from 'react';

const WindowsXPPortfolio = () => {
  // State variables
  const [windows, setWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showIE, setShowIE] = useState(false);
  const [desktopContextMenu, setDesktopContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [bootScreen, setBootScreen] = useState(true);
  const [fadeBoot, setFadeBoot] = useState(false);
  const [systemSounds, setSystemSounds] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [showClippy, setShowClippy] = useState(false);
  const [clippyMessage, setClippyMessage] = useState('');
  const [clippyPosition, setClippyPosition] = useState({ x: 100, y: 200 });
  const desktopRef = useRef(null);
  const [showLightbox, setShowLightbox] = useState(null);


  // Desktop icons
  const desktopIcons = [
    { id: 'about', title: 'About Me', icon: '🧑‍💼', shortcutArrow: true },
    { id: 'resume', title: 'Resume', icon: '📄', shortcutArrow: true },
    { id: 'portfolio', title: 'Portfolio', icon: '💼', shortcutArrow: true },
    { id: 'generative', title: 'Fun Stuff', icon: '🧪', shortcutArrow: true },
    { id: 'blog', title: 'Blog', icon: '✍️', shortcutArrow: true },
    { id: 'contact', title: 'Contact Me', icon: '📨', shortcutArrow: true },
    { id: 'recycle', title: 'Recycle Bin', icon: '🗑️', shortcutArrow: false },
    { id: 'internet', title: 'Internet Explorer', icon: '🌐', shortcutArrow: false },
  ];

  // Portfolio items
  const portfolioItems = [
    { id: 'filmmaking', title: 'Filmmaking', icon: '🎬' },
    { id: 'writing', title: 'Writing', icon: '📝' },
    { id: 'photography', title: 'Photography', icon: '📸' },
    { id: 'design', title: 'Design Work', icon: '🎨' },
  ];

  // Photos for photography portfolio
  const editorialPhotos = import.meta.glob('/src/assets/photos/editorial/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
  });
  
  const productPhotos = import.meta.glob('/src/assets/photos/product/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
  });
  
  const photos = [
    ...Object.entries(editorialPhotos).map(([path, src], i) => ({
      id: `editorial-${i}`,
      src,
      category: 'editorial'
    })),
    ...Object.entries(productPhotos).map(([path, src], i) => ({
      id: `product-${i}`,
      src,
      category: 'product'
    }))
  ];
  const designFiles = import.meta.glob('/src/assets/design/*.pdf', {
    eager: true,
    import: 'default',
  });
  
  const designs = Object.entries(designFiles).map(([path, src], i) => {
    const filename = path.split('/').pop().replace('.pdf', '');
    return {
      id: `design-${i}`,
      title: filename.replace(/[-_]/g, ' '),
      src,
    };
  });

  const generativeMedia = import.meta.glob('/src/assets/generative/*.{jpg,jpeg,png,mp4,webm}', {
    eager: true,
    import: 'default',
  });
  
  const generativeItems = [
    // hosted (drive) embeds
    {
      id: 'walkthrough',
      type: 'embed',
      title: 'Walkthrough',
      embedSrc: 'https://drive.google.com/file/d/1aKVOe8bpwf1YL6KYgOrWHlGlik0ZLFp1/preview'
    },
    {
      id: 'parody',
      type: 'embed',
      title: 'Parody Video',
      embedSrc: 'https://drive.google.com/file/d/13EoMv4M6_Oxv38uUsld4v20QmendsZI1/preview'
    },
    // local files
    ...Object.entries(generativeMedia).map(([path, src], i) => {
      const filename = path.split('/').pop();
      const isVideo = /\.(mp4|webm)$/i.test(filename);
      return {
        id: `local-${i}`,
        type: isVideo ? 'video' : 'image',
        title: filename.replace(/[-_]/g, ' '),
        src,
      };
    }),
  ];
  
  

  // System sounds function
  const playSound = (soundType) => {
    if (!systemSounds) return;
    
    const sounds = {
      startup: "https://www.myinstants.com/media/sounds/windows_xp_startup.mp3",
      error: "https://www.myinstants.com/media/sounds/windows-xp-error.mp3",
      notify: "https://www.myinstants.com/media/sounds/windows-xp-balloon.mp3",
      click: "https://www.myinstants.com/media/sounds/roblox-click-sound_jgRFOOu.mp3",
      shutdown: "https://www.myinstants.com/media/sounds/windows-xp-shutdown.mp3"
    };
    
    const audio = new Audio(sounds[soundType]);
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Audio playback prevented: " + e));
  };
  
  // Boot screen effect
  useEffect(() => {
    if (bootScreen) {
      setTimeout(() => {
        playSound('startup');
        setBootScreen(false);
      }, 3000);
    }
  }, [bootScreen]);
  
  // System notification
  const showSystemNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    playSound('notify');
    
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };
  
  // Context menu for desktop
  const handleContextMenu = (e) => {
    e.preventDefault();
    
    // Don't show context menu if clicking on a window
    if (e.target.closest('[id^="window-"]')) return;
    
    setDesktopContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  
  // Window contents
  const windowContents = {
    recycle: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Recycle Bin</h2>
        <div className="text-center p-8">
          <div className="text-6xl mb-4"></div>
          <p className="mb-2">Your Recycle Bin is empty</p>
          <p className="text-sm text-gray-500">Items you delete will appear here</p>
        </div>
      </div>
    ),
    internet: (
      <div className="p-4 h-full w-full">
        <iframe
          src="https://en.wikipedia.org/wiki/Main_Page"
          className="w-full h-full border border-gray-300"
          frameBorder="0"
        />
      </div>
    ),
    about: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">About Me</h2>
        <div className="mb-4">
  <img 
    src="/headshot.jpg" 
    alt="Travis Simons" 
    className="w-32 h-32 object-cover rounded-full shadow-md border border-gray-300"
  />
</div>

        <p className="mb-2">Hello! My name is Travis Simons. I am a digital media expert and a senior at the University of Texas at Austin purusing a bachelor in Radio-Television-Film and a minor in Architectural Studies. I am passionate about creating engaging content and telling stories through various mediums. I am currently seeking opportunities in the media and tech industries.
        </p>
        <p className="mb-2">I have recent experience in digital media, IT, A/V, and Hospitaltiy. I specialize in multimedia, including video, image, and interaactive. My current focus revolves around leveraging generative tools for media workflows.</p>
        <p>When I'm not working or learning, I enjoy cooking, working out, and following current events.</p>
      </div>
    ),
    resume: (
      <div className="w-full h-full">
        <iframe
          src="/simons_resume.pdf"
          title="Resume PDF"
          className="w-full h-full border-none"
        />
      </div>
    ),
    portfolio: (
      <div className="p-4 grid grid-cols-2 gap-4">
        {portfolioItems.map(item => (
          <div 
            key={item.id} 
            className="text-center p-4 border border-gray-300 cursor-pointer hover:bg-blue-100"
            onClick={() => openWindow(item.id, item.title, `${item.icon} ${item.title}`, '70%', '70%', 'portfolio')}
          >


<img src={`/icons/${item.id}.png`} alt={item.title} className="w-10 h-10 mx-auto mb-2" />
<div>{item.title}</div>
          </div>
        ))}
      </div>
    ),
    filmmaking: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Filmmaking Portfolio</h2>
    
        <div className="mb-6">
          <h3 className="text-lg font-bold">Post Post</h3>
          <p className="text-sm italic">Director of Photography, Editor • 2022</p>
          <p className="mb-2">A poignant narrative short about loss and grief featuring precise edits and dreamlike imagery. </p>
          <div className="aspect-w-16 aspect-h-9 max-w-3xl w-full">
            <iframe
              src="https://drive.google.com/file/d/1PHg4TI42p1bGdvLZ-TLy_VpIgo77Bbtq/preview"
              allow="autoplay"
              className="w-full h-full rounded shadow"
            />
          </div>
        </div>
    
        <div className="mb-6">
          <h3 className="text-lg font-bold">Station Waterloo</h3>
          <p className="text-sm italic">Director, Writer, Director of Photography, Editor • 2022</p>
          <p className="mb-2">Msuic video leveraging a unique location and practical effects to create a groounded science fiction aesthetic. </p>
          <div className="aspect-w-16 aspect-h-9 max-w-3xl w-full">
            <iframe
              src="https://drive.google.com/file/d/1oQb_p8Rt9xK5mJydtkq0a59VUWG9YbmZ/preview"
              allow="autoplay"
              className="w-full h-full rounded shadow"
            />
          </div>
        </div>
    
       <div className="mb-6">
          <h3 className="text-lg font-bold">UAP Documentary</h3>
          <p className="text-sm italic">Director, Editor • 2023</p>
          <p className="mb-2">Documentary short covering recent developments in the area of Ufology. Leverages generative tools for storytelling purposes.</p>
          <div className="aspect-w-16 aspect-h-9 max-w-3xl w-full">
            <iframe
              src="https://drive.google.com/file/d/GOOGLE_DRIVE_FILE_ID_3/preview"
              allow="autoplay"
              className="w-full h-full rounded shadow"
            />
          </div>
        </div>
      </div>
    ),
    writing: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Writing Samples</h2>
    
        <div className="mb-4">
          <h3 className="text-lg font-bold">Prop A Passed. So What?</h3>
          <p className="text-sm italic">The Texas Orator • 2020</p>
          <p className="mb-2">
            A breakdown of Austin’s historic vote for public transit funding and why the victory matters — or doesn’t.
          </p>
          <a
            href="https://thetexasorator.com/2020/11/25/prop-a-passed-so-what/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Read Full Piece
          </a>
        </div>
    
        <div className="mb-4">
          <h3 className="text-lg font-bold">The Climate Question</h3>
          <p className="text-sm italic">The Texas Orator • 2021</p>
          <p className="mb-2">
            An essay on the futility of American climate politics and the hard inevitability of adaptation in a warming world.
          </p>
          <a
            href="https://thetexasorator.com/2021/03/03/the-climate-question/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Read Full Piece
          </a>
        </div>
      </div>
    ),
    
    photography: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Photography</h2>
        {['editorial', 'product'].map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold capitalize mb-2">{category}</h3>
            <div className="grid grid-cols-3 gap-2">
              {photos
                .filter(p => p.category === category)
                .map(photo => (
                  <img
                    key={photo.id}
                    src={photo.src}
                    alt={photo.id}
                    className="w-full h-auto border border-white cursor-pointer"
                    onClick={() => setShowLightbox(photo)}
                  />
                ))}
            </div>
            
          </div>
        ))}
      </div>
    ),
  
    design: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Design Work</h2>
        {designs.map((d) => (
          <div key={d.id} className="mb-8">
            <h3 className="text-lg font-bold mb-2">{d.title}</h3>
            <div className="w-full max-w-4xl h-[720px] border border-gray-300 rounded overflow-hidden">
              <iframe
                src={d.src}
                title={d.title}
                className="w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>
    ),
    
    generative: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Fun Stuff</h2>
        <div className="grid grid-cols-3 gap-4">
        {generativeItems.map((item) => (
  <div key={item.id} className="border border-gray-300 rounded overflow-hidden aspect-w-16 aspect-h-9">
  {item.type === 'image' ? (
    <img
      src={item.src}
      alt={item.title}
      className="w-full h-full object-cover cursor-pointer"
      onClick={() => setShowLightbox({ src: item.src })}
    />
  ) : item.type === 'embed' ? (
    <iframe
      src={item.embedSrc}
      title={item.title}
      className="w-full h-full"
      allow="autoplay; encrypted-media"
      allowFullScreen
      frameBorder="0"
    />
  ) : (
    <video
      src={item.src}
      controls
      className="w-full h-full object-cover"
    />
  )}
</div>
))}

        </div>
      </div>
    ),
    
    blog: (
      <div className="p-4">
  <h2 className="text-xl font-bold mb-4">Blog</h2>
  <p className="mb-2">
    visit my substack to read short essays, machine learning tutorials, and more:
  </p>
  <a
    href="https://t33d0g.substack.com"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block px-4 py-2 mt-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition"
  >
    📰 open blog in browser
  </a>
</div>
    ),
    contact: (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Contact Me</h2>
        <p className="mb-4">Feel free to reach out to me through any of the following channels:</p>
        <ul className="ml-4 mb-4">
          <li className="mb-2">
          <a href="mailto:travis.simons@utexas.edu" className="text-blue-500 hover:underline">travis.simons@utexas.edu</a>
          </li>
          <li className="mb-2">
            <span className="font-bold"></span> <a href="https://www.linkedin.com/in/travisksimons" target="_blank" className="text-blue-500 hover:underline">linkedin.com/in/travisksimons</a>
          </li>
        </ul>
      </div>
    ),
  };

  // Open window function
  const openWindow = (id, title, content, width = '60%', height = '70%', parent = null) => {
    // Close the start menu if it's open
    if (startMenuOpen) {
      setStartMenuOpen(false);
    }

    // Check if window is already open
    const existingWindowIndex = windows.findIndex(w => w.id === id);
    if (existingWindowIndex !== -1) {
      // If window exists, bring it to the front
      setActiveWindow(id);
      const updatedWindows = [...windows];
      const existingWindow = updatedWindows.splice(existingWindowIndex, 1)[0];
      updatedWindows.push(existingWindow);
      setWindows(updatedWindows);
      return;
    }

    const newWindow = {
      id,
      title: title || id,
      content: windowContents[id] || content,
      position: { x: 50 + (windows.length * 30), y: 50 + (windows.length * 20) },
      size: { width, height },
      minimized: false,
      parent
    };

    setWindows([...windows, newWindow]);
    setActiveWindow(id);
  };

  // Close window function
  const closeWindow = (id) => {
    setWindows(windows.filter(window => window.id !== id));
    if (activeWindow === id) {
      setActiveWindow(windows.length > 1 ? windows[windows.length - 2].id : null);
    }
  };

  // Minimize window function
  const minimizeWindow = (id) => {
    setWindows(windows.map(window => 
      window.id === id ? { ...window, minimized: true } : window
    ));
    setActiveWindow(windows.length > 1 ? windows[windows.length - 2].id : null);
  };

  // Restore window function
  const restoreWindow = (id) => {
    setWindows(windows.map(window => 
      window.id === id ? { ...window, minimized: false } : window
    ));
    setActiveWindow(id);
  };

  // Start dragging window
  const startDrag = (e, id) => {
    const windowElement = document.getElementById(`window-${id}`);
    const rect = windowElement.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragging(id);
    setActiveWindow(id);
    
    // Bring window to front
    const windowIndex = windows.findIndex(w => w.id === id);
    if (windowIndex !== -1) {
      const updatedWindows = [...windows];
      const draggedWindow = updatedWindows.splice(windowIndex, 1)[0];
      updatedWindows.push(draggedWindow);
      setWindows(updatedWindows);
    }
  };

  // Handle drag
  const handleDrag = (e) => {
    if (dragging && desktopRef.current) {
      const desktopRect = desktopRef.current.getBoundingClientRect();
      const windowIndex = windows.findIndex(w => w.id === dragging);
      
      if (windowIndex !== -1) {
        const updatedWindows = [...windows];
        const x = e.clientX - desktopRect.left - dragOffset.x;
        const y = e.clientY - desktopRect.top - dragOffset.y;
        
        updatedWindows[windowIndex] = {
          ...updatedWindows[windowIndex],
          position: { x, y }
        };
        
        setWindows(updatedWindows);
      }
    }
  };

  // End drag
  const endDrag = () => {
    setDragging(null);
  };

  // Handle desktop click
  const handleDesktopClick = () => {
    setStartMenuOpen(false);
    setSelectedIcon(null);
    setDesktopContextMenu({ show: false, x: 0, y: 0 });
  };

  // Handle icon click
  const handleIconClick = (e, iconId) => {
    e.stopPropagation();
    setSelectedIcon(iconId);
    playSound('click');
  };

  // Handle icon double click
  const handleIconDoubleClick = (e, iconId) => {
    e.stopPropagation();
    openWindow(iconId, desktopIcons.find(icon => icon.id === iconId)?.title);
    
    // Show notification for specific icons
    if (iconId === 'recycle' && !showRecycleBin) {
      setShowRecycleBin(true);
      setTimeout(() => {
        showSystemNotification('Recycle Bin is now accessible');
      }, 1000);
    }
    
    if (iconId === 'internet') {
      setShowIE(true);
      showSystemNotification('Internet Explorer is connecting...');
    }
    
    // Show Clippy with random advice after opening windows
    const randomNum = Math.floor(Math.random() * 10);
    if (randomNum < 3) { // 30% chance to show Clippy
      setTimeout(() => {
        triggerClippy(iconId);
      }, 1500);
    }
  };
  
  // Clippy messages based on which window was opened
  const triggerClippy = (windowId) => {
    const messages = {
      about: "It looks like you're trying to learn about this person. Would you like help with that?",
      resume: "It looks like you're viewing a resume. Would you like help formatting your own resume?",
      portfolio: "It looks like you're browsing a portfolio. Would you like tips on evaluating creative work?",
      research: "It looks like you're reading research. Would you like help understanding academic papers?",
      blog: "It looks like you're reading a blog. Would you like help subscribing to RSS feeds?",
      contact: "It looks like you're trying to contact someone. Would you like help drafting an email?",
      recycle: "It looks like you're viewing the Recycle Bin. Would you like help permanently deleting these files?",
      internet: "It looks like you're browsing the internet. Would you like me to search for websites for you?",
      filmmaking: "It looks like you're viewing filmmaking projects. Would you like tips on film analysis?",
      writing: "It looks like you're reading writing samples. Would you like help improving your own writing?",
      photography: "It looks like you're viewing photographs. Would you like help organizing your own photo collection?",
      design: "It looks like you're viewing design work. Would you like help understanding design principles?"
    };
    
    // Set random position on the right side of the screen
    const maxWidth = window.innerWidth - 220;
    const maxHeight = window.innerHeight - 200;
    const randomX = Math.max(maxWidth * 0.6, Math.random() * maxWidth);
    const randomY = Math.random() * maxHeight * 0.7;
    
    setClippyPosition({ x: randomX, y: randomY });
    setClippyMessage(messages[windowId] || "Hi there! It looks like you're using a Windows XP portfolio. Would you like help with that?");
    setShowClippy(true);
    
    // Auto-hide Clippy after 8 seconds
    setTimeout(() => {
      setShowClippy(false);
    }, 8000);
  };

  // Add event listeners for drag handling
  useEffect(() => {
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', endDrag);

    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', endDrag);
    };
  }, [dragging, dragOffset]);

  // Go back to parent window function
  const goBack = (parentId) => {
    // Close the current window
    const currentWindow = windows.find(w => w.id === activeWindow);
    if (currentWindow) {
      closeWindow(currentWindow.id);
    }
    
    // Bring the parent window to front if it exists
    const parentWindow = windows.find(w => w.id === parentId);
    if (parentWindow) {
      setActiveWindow(parentId);
      const updatedWindows = [...windows];
      const parentIndex = updatedWindows.findIndex(w => w.id === parentId);
      if (parentIndex !== -1) {
        const parent = updatedWindows.splice(parentIndex, 1)[0];
        updatedWindows.push(parent);
        setWindows(updatedWindows);
      }
    } else {
      // If parent window doesn't exist (was closed), reopen it
      openWindow(parentId, desktopIcons.find(icon => icon.id === parentId)?.title);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden relative desktop-bg"
    onClick={handleDesktopClick}
    onContextMenu={handleContextMenu}
    ref={desktopRef}
  >
     {bootScreen && (
  <div
    className={`absolute inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 ${fadeBoot ? 'opacity-0' : 'opacity-100'}`}
    onTransitionEnd={() => {
      if (fadeBoot) setBootScreen(false);
    }}
  >
    <video
      src="/icons/startup.mp4"
      autoPlay
      muted
      playsInline
      onEnded={() => setFadeBoot(true)}
      className="w-[480px] h-auto"
    />
  </div>
)}
      
      {/* Desktop Icons */}
      <div className="flex-1 p-4 grid grid-cols-6 gap-2 content-start">
        {desktopIcons.map(icon => (
          <div 
            key={icon.id}
            className={`flex flex-col items-center p-2 w-24 cursor-pointer ${selectedIcon === icon.id ? 'bg-blue-200 bg-opacity-50' : ''}`}
            onClick={(e) => handleIconClick(e, icon.id)}
            onDoubleClick={(e) => handleIconDoubleClick(e, icon.id)}
          >
            <div className="relative">
            <img src={`/icons/${icon.id}.png`} alt={icon.title} className="w-10 h-10 mb-1" />
            {icon.shortcutArrow && (
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-800 text-white text-xs rounded-sm flex items-center justify-center">
                  ↗
                </div>
              )}
            </div>
            <div className="text-center text-white text-sm font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis w-full shadow-sm">
              {icon.title}
            </div>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.filter(window => !window.minimized).map(window => (
        <div
          id={`window-${window.id}`}
          key={window.id}
          className={`absolute rounded-t-md overflow-hidden flex flex-col border border-gray-500 ${activeWindow === window.id ? 'z-20 shadow-lg' : 'z-10 shadow'}`}
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveWindow(window.id);
          }}
        >
          {/* Window Title Bar */}
          <div 
            className={`flex items-center px-2 py-1 ${activeWindow === window.id ? 'bg-gradient-to-r from-blue-700 to-blue-500' : 'bg-gradient-to-r from-gray-400 to-gray-300'}`}
            onMouseDown={(e) => startDrag(e, window.id)}
          >
<img
  src={`/icons/${window.id}.png`}
  alt={`${window.id} icon`}
  className="w-4 h-4 mr-2"
/>            <div className="flex-1 text-white font-semibold truncate drop-shadow-sm">{window.title || window.id}</div>
            <div className="flex">
              <button className="w-6 h-6 flex items-center justify-center text-white bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 border border-blue-700 rounded-t-sm mr-1" onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}>
                -
              </button>
              <button className="w-6 h-6 flex items-center justify-center text-white bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 border border-red-700 rounded-t-sm" onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}>
                ×
              </button>
            </div>
          </div>

          {/* Window Menu Bar */}
          <div className="bg-gray-100 px-2 py-1 flex text-sm border-b border-gray-300">
            <button className="mr-4 hover:underline">File</button>
            <button className="mr-4 hover:underline">Edit</button>
            <button className="mr-4 hover:underline">View</button>
            <button className="hover:underline">Help</button>
          </div>

          {/* Window Content */}
          <div className="flex-1 bg-white overflow-auto p-2">
            {window.parent && (
              <button 
                className="mb-2 px-2 py-1 bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-300 rounded flex items-center text-sm"
                onClick={() => goBack(window.parent)}
              >
                ← Back
              </button>
            )}
            {window.content}
          </div>

          {/* Window Status Bar */}
          <div className="bg-gray-200 px-2 py-0.5 text-xs flex justify-between border-t border-gray-300">
            <div>{window.id}</div>
            <div>{new Date().toLocaleString()}</div>
          </div>
        </div>
      ))}

      {/* Desktop Context Menu */}
      {desktopContextMenu.show && (
        <div 
          className="absolute z-50 bg-white border border-gray-300 shadow-lg"
          style={{ left: desktopContextMenu.x, top: desktopContextMenu.y }}
          onClick={() => setDesktopContextMenu({ show: false, x: 0, y: 0 })}
        >
          <div className="hover:bg-blue-100 p-2 cursor-pointer border-b border-gray-300">New</div>
          <div className="hover:bg-blue-100 p-2 cursor-pointer" onClick={() => showSystemNotification('Refreshing desktop...')}>Refresh</div>
          <div className="hover:bg-blue-100 p-2 cursor-pointer">Paste</div>
          <div className="hover:bg-blue-100 p-2 cursor-pointer border-b border-gray-300">Paste Shortcut</div>
          <div className="hover:bg-blue-100 p-2 cursor-pointer" onClick={() => {
            setSystemSounds(!systemSounds);
            showSystemNotification(systemSounds ? 'System sounds turned off' : 'System sounds turned on');
          }}>
            {systemSounds ? 'Mute System Sounds' : 'Enable System Sounds'}
          </div>
          <div className="hover:bg-blue-100 p-2 cursor-pointer border-b border-gray-300">Properties</div>
        </div>
      )}

      {/* System Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-gray-200 w-80 border border-gray-400 shadow-lg">
            <div className="bg-blue-700 text-white p-2 flex justify-between items-center">
              <span>Windows</span>
              <button 
                className="text-white"
                onClick={() => setShowErrorPopup(false)}
              >✕</button>
            </div>
            <div className="p-4 flex">
              <div className="text-red-500 text-4xl mr-3">⚠️</div>
              <div>
                <p className="mb-2">This action cannot be completed.</p>
                <p className="text-sm">The system is busy or unavailable.</p>
              </div>
            </div>
            <div className="p-3 bg-gray-300 flex justify-end">
              <button 
                className="px-4 py-1 bg-gray-100 border border-gray-400"
                onClick={() => setShowErrorPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* System Notification */}
      {showNotification && (
        <div className="absolute bottom-10 right-2 w-64 bg-yellow-50 border border-yellow-300 rounded-t-md overflow-hidden z-40 shadow-lg">
          <div className="bg-blue-700 text-white p-1 text-xs flex justify-between items-center">
            <span>System Notification</span>
            <button 
              className="text-white"
              onClick={() => setShowNotification(false)}
            >✕</button>
          </div>
          <div className="p-3 flex">
            <div className="text-blue-500 text-xl mr-2">ℹ️</div>
            <div className="text-sm">{notificationMessage}</div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="w-full bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 h-10 flex items-center px-1 z-30 shadow-md border-t border-blue-900">
       {/* Start Button */}
<button 
  className={`h-8 px-2 flex items-center rounded-l-md shadow-md ${startMenuOpen ? 'bg-blue-900' : 'bg-gradient-to-b from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
  onClick={(e) => { 
    e.stopPropagation(); 
    setStartMenuOpen(!startMenuOpen); 
    playSound('click');
  }}
>
  <img 
    src="/icons/starticon.png" 
    alt="Start Icon" 
    className="w-5 h-5 mr-2"
  />
  <span className="text-white font-bold drop-shadow-sm">start</span>
</button>

        {/* Taskbar Divider */}
        <div className="h-8 mx-1 border-l border-blue-900 border-r border-blue-500"></div>

       {/* Quick Launch Bar */}
<div className="h-8 px-1 mx-1 flex items-center border-r border-blue-900">
  <button className="w-6 h-6 flex items-center justify-center bg-blue-600 rounded hover:bg-blue-500 mx-0.5 border border-blue-700 overflow-hidden">
    <img src="/icons/quick-browser.png" alt="Browser" className="w-4 h-4" />
  </button>
  <button className="w-6 h-6 flex items-center justify-center bg-blue-600 rounded hover:bg-blue-500 mx-0.5 border border-blue-700 overflow-hidden">
    <img src="/icons/quick-folder.png" alt="Folder" className="w-4 h-4" />
  </button>
</div>

        {/* Window Buttons */}
        <div className="flex-1 flex items-center pl-2 space-x-1">
          {windows.map(window => (
            <button
              key={window.id}
              className={`h-7 px-2 flex items-center rounded-t-sm ${activeWindow === window.id && !window.minimized ? 'bg-gradient-to-b from-blue-100 to-blue-300 text-black border border-blue-400 border-b-0' : 'bg-gradient-to-b from-blue-600 to-blue-700 text-white border border-blue-800 hover:from-blue-500 hover:to-blue-600'}`}
              onClick={(e) => { 
                e.stopPropagation(); 
                window.minimized ? restoreWindow(window.id) : setActiveWindow(window.id);
                playSound('click');
              }}
            >
              <img
  src={`/icons/${window.id}.png`}
  alt={`${window.id} icon`}
  className="w-4 h-4 mr-1"
/>
              <span className="text-sm truncate max-w-32">{window.title}</span>
            </button>
          ))}
        </div>

        {/* System Tray */}
        <div className="bg-gradient-to-b from-blue-700 to-blue-600 h-8 px-2 flex items-center border-l border-blue-900">
          <div className="text-white text-xs mr-2">
            <span role="img" aria-label="sound">🔊</span>
          </div>
          <div className="text-white text-xs mr-2">
            <span role="img" aria-label="network">📶</span>
          </div>
          <div className="text-white text-xs mr-2 flex items-center">
            <span role="img" aria-label="battery">🔋</span>
            <span className="ml-1">{batteryLevel}%</span>
          </div>
          <span className="text-white text-sm">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div 
          className="absolute bottom-10 left-0 w-80 bg-white z-40 rounded-t-md overflow-hidden shadow-lg border border-blue-900"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 h-24 p-2 flex items-start">
          <img 
  src="/headshot.jpg" 
  alt="User Headshot" 
  className="w-10 h-10 mr-2 rounded-full border border-white shadow-sm"
/>
            <div className="text-white font-semibold text-xl drop-shadow-md">[Your Name]</div>
          </div>
          <div className="flex">
            <div className="bg-white flex-1 p-2 border-r border-gray-300">
              <div className="text-blue-700 font-bold p-2 mb-2 border-b border-gray-300">
                Programs
              </div>
              {desktopIcons.map(icon => (
                <div 
                  key={icon.id}
                  className="flex items-center p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    openWindow(icon.id, icon.title);
                    setStartMenuOpen(false);
                    playSound('click');
                  }}
                >
<img src={`/icons/${icon.id}.png`} alt={icon.title} className="w-5 h-5 mr-2" />
<div>{icon.title}</div>
                </div>
              ))}
              <div className="p-2 mt-4">
                <div className="flex items-center p-2 hover:bg-blue-100 cursor-pointer border-t border-gray-200">
                <img src="/icons/games.png" alt="Games" className="w-5 h-5 mr-2" />
                <div>Games</div>
                </div>
                <div className="flex items-center p-2 hover:bg-blue-100 cursor-pointer">
                <img src="/icons/documents.png" alt="Documents" className="w-5 h-5 mr-2" />
                <div>Documents</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 w-20">
              <div className="text-center p-2 mt-2 hover:bg-blue-100 cursor-pointer">
              <img src="/icons/mycomputer.png" alt="My Computer" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs">My Computer</div>
              </div>
              <div className="text-center p-2 hover:bg-blue-100 cursor-pointer">
              <img src="/icons/mydocuments.png" alt="My Documents" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs">My Documents</div>
              </div>
              <div className="text-center p-2 hover:bg-blue-100 cursor-pointer">
              <img src="/icons/controlpanel.png" alt="Control Panel" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs">Control Panel</div>
              </div>
              <div className="text-center p-2 hover:bg-blue-100 cursor-pointer">
              <img src="/icons/printers.png" alt="Printers" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs">Printers</div>
              </div>
              <div className="text-center p-2 hover:bg-blue-100 cursor-pointer">
              <img src="/icons/help.png" alt="Help" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs">Help</div>
              </div>
              <div className="text-center p-2 hover:bg-blue-100 cursor-pointer">
              <img src="/icons/search.png" alt="Search" className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs">Search</div>
              </div>
              <div className="text-center p-2 hover:bg-blue-100 cursor-pointer">
              <img src="/icons/run.png" alt="Run..." className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs">Run...</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-200 p-2 flex items-center border-t border-gray-300">
          <img src="/icons/shutdown.png" alt="Turn Off Computer" className="w-5 h-5 mr-2" />
          <div 
              className="hover:bg-blue-100 cursor-pointer p-1"
              onClick={() => {
                playSound('shutdown');
                setBootScreen(true);
                setTimeout(() => {
                  setBootScreen(false);
                  playSound('startup');
                }, 5000);
              }}
            >
              Turn Off Computer
            </div>
          </div>
        </div>
      )}
      
      {/* Clippy Assistant */}
      {showClippy && (
        <div
        className="absolute z-50 w-60 flex flex-col"
        style={{ left: clippyPosition.x, top: clippyPosition.y }}
      >
        <div className="bg-yellow-100 border border-yellow-300 p-3 rounded-lg shadow-lg">
          <div className="flex items-start">
            <div className="mr-2 flex-shrink-0">
              <img src="/icons/clippy.png" alt="Clippy" className="w-12 h-12" />
          
            </div>
      
            <div className="flex-1">
              <div className="text-sm mb-1">{clippyMessage}</div>
              <div className="flex justify-end space-x-1 mt-2">
                <button
                  className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-xs rounded"
                  onClick={() => setShowClippy(false)}
                >
                  Yes
                </button>
                <button
                  className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-xs rounded"
                  onClick={() => setShowClippy(false)}
                >
                  No
                </button>
                <button
                  className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-xs rounded"
                  onClick={() => setShowClippy(false)}
                >
                  × Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
          )}
          {showLightbox && (
  <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center">
    <div
      className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
      onClick={() => setShowLightbox(null)}
    >
      ✕
    </div>
    <img
      src={showLightbox.src}
      alt="preview"
      className="max-h-[80vh] max-w-[90vw] rounded shadow-2xl"
    />
  </div>
)}
          </div>
        );
        };
        
        export default WindowsXPPortfolio;