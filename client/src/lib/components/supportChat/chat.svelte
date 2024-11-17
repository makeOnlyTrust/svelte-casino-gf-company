<script>
  // @ts-nocheck
  import { onMount, afterUpdate, tick } from 'svelte';
  import { socket, checkRoom, leaveRoom, uuid } from '@store/store';
  import { toDataUrl, dataURItoBlob } from '$lib/utils/chatUtils';

  import FileInput from '$lib/components/supportChat/file/fileinput.svelte';
  import Message from '$lib/components/supportChat/message/message.svelte';
  import Button from '$lib/components/supportChat/button/button.svelte';
  import { getChatHistory } from '@apis/chat';
  import { saveImageWebp, saveTempImage } from '@apis/image';
  import globalStore from '@store/globalStore';

  import {
    CloseIcon,
    ClockIcon,
    ChatIcon,
    PaperPlaneIcon,
    TopArrowIcon,
    ImageIcon
  } from '$lib/components/supportChat/icons.import';

  const ID_KEY = import.meta.env.VITE_ID_KEY;

  let messageValue = '',
    messages = [],
    chatMessages,
    fileValue,
    sendButton,
    adminOnlineStatus = false,
    isSending = false,
    chatStart = false,
    displayPart = {
      home: true,
      contact: false,
      chat: false
    };
  onMount(() => {
    checkRoom();
    onGetChatHistory();
    leaveChatRoom();
  });

  $: {
    messages;
  }

  const onGetChatHistory = async () => {
    let info = localStorage.getItem(ID_KEY);
    if (info) {
      let JsonInfo = JSON.parse(info);

      if (JsonInfo.room) {
        let res = await getChatHistory({
          room: JsonInfo.room
        });
        if (res.success) {
          // chatHistory = res.data.history;
          messages = res.data.history;
          // messages = chatHistory;
        }
      }
    }
  };

  const handleMessage = async (e) => {
    const file = fileValue.files[0] || null;
    if (e.target.tagName === 'FORM' && !messageValue) return;

    let info = JSON.parse(localStorage.getItem(ID_KEY));
    let username;
    let room;
    if (info && info.room) {
      username = info.username;
      room = info.room;
    }

    isSending = true;
    let permanentFile;
    const imageData = file && (await toDataUrl(file));
    if (imageData) {
      const formData = new FormData();
      const blob = dataURItoBlob(imageData);
      formData.append('image', blob, 'image.png');

      const tempFile = await saveTempImage({ formData });
      permanentFile = await saveImageWebp({
        filename: tempFile.data.filename,
        ext: 'webp'
      });
    }
    const dataMessage = {
      username,
      message: messageValue,
      imageName: file && file.name,
      image: permanentFile && permanentFile.data && permanentFile.data.path,
      room: room,
      status: adminOnlineStatus
    };

    socket.emit('send-message', dataMessage, (me) => {
      me.isSelf = true;
      messages = [...messages, me];
      messageValue = '';
      fileValue.value = '';
      isSending = false;
    });
  };

  const onStartChat = () => {
    chatStart = true;
    let info = JSON.parse(localStorage.getItem(ID_KEY));
    let user = { username: 'Anonymous', room: uuid('CHATROOM') };
    if (info && info.room) {
      user = { username: info.username, room: info.room };
    }

    socket.emit('join-room', user, () => {
      localStorage.setItem(ID_KEY, JSON.stringify(user));

      const dataMessage = {
        username: 'Anonymous',
        message: 'Hello',
        imageName: '',
        image: '',
        room: user.room,
        status: adminOnlineStatus
      };

      socket.emit('send-message', dataMessage, (me) => {
        me.isSelf = true;
        messages = [...messages, me];
        isSending = false;
      });
    });
  };

  afterUpdate(() => {
    if (!chatMessages) return;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatMessages.focus();
  });

  socket.on('server-message', (data) => {
    messages = [...messages, data];
  });

  socket.on('server-message-update-delete', (data, status) => {
    let isId = messages.findIndex((item) => item.msg_id == data.msg_id);
    if (status == 'update') {
      if (isId !== -1) {
        messages[isId] = data;
      }
    } else {
      messages = [...messages.slice(0, isId), ...messages.slice(isId + 1)];
    }
  });

  socket.on('admin-offline-now', (data) => {
    if (data == 'offline') {
      adminOnlineStatus = false;
    }
  });
  socket.on('admin-online-now', (data) => {
    if (data == 'online') {
      adminOnlineStatus = true;
    }
  });

  const handleEnter = (e) => {
    if (e.key === 'Enter') sendButton.click();
  };

  const toggleChat = () => {
    if ($globalStore.supportChatOpen) leaveChatRoom();
    globalStore.toggleItem('supportChatOpen', !$globalStore.supportChatOpen);
  };
  const leaveChatRoom = () => {
    let info = JSON.parse(localStorage.getItem(ID_KEY));
    if (info && info.room) {
      leaveRoom('user', info.room, () => {});
    }
  };

  const displayPage = (key) => {
    let info = JSON.parse(localStorage.getItem(ID_KEY));
    if (info != null || info != undefined) {
      chatStart = true;
    }
    for (let key_ in displayPart) {
      if (key_ == key) {
        displayPart[key_] = true;
      } else {
        displayPart[key_] = false;
      }
    }
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:window on:keydown={handleEnter} />

<div class="">
  <div
    class="{$globalStore.supportChatOpen ? 'block' : 'hidden'} bottom-[75px] gfc-widget dark {$globalStore.chatOpen
      ? 'md:right-[320px]'
      : 'md:right-[40px]'}"
  >
    <div class="gfc-top">
      <div class="gfc-top-inner">
        <div class="gfc-top-content-wrapper">
          <div class="gfc-close" on:click={toggleChat}>
            <!-- <img src="/imgs/support-chat/time.png" alt="" /> -->
            <CloseIcon className="w-6 h-6 text-gray-800 dark:text-white" />
          </div>

          <div class={`logo ${displayPart.home ? 'block' : 'hidden'}`}>
            <img src="/imgs/support-chat/chat-logo.png" alt="" class="" />
          </div>

          <div class={`gfc-top-nav ${displayPart.chat ? 'block' : 'hidden'}`}>
            <ul>
              <li class={``} on:click={() => displayPage('home')}>Home</li>
              <li class={`${displayPart.chat ? 'active' : ''}`} on:click={() => displayPage('chat')}>Live Chat</li>
            </ul>
          </div>
        </div>

        <div class={`gfc-intro ${displayPart.home ? 'block' : 'hidden'}`}>
          <h2>Let’s start a new<br /> chat with us 👋</h2>
        </div>
      </div>
    </div>

    <div class="gfc-main">
      <div class={`${displayPart.home ? 'block' : 'hidden'} chat-welcome`}>
        <div class="chat-start">
          <h3>Start Live Chat</h3>
          <div class="staff-preview">
            <div class="staff-images">
              <div class="img1">
                <img src="/imgs/support-chat/person1.png" alt="" />
              </div>
              <div class="img2">
                <img src="/imgs/support-chat/person2.png" alt="" />
              </div>
              <div class="img3">
                <img src="/imgs/support-chat/person3.png" alt="" />
              </div>
            </div>
            <div class="reply-info">
              <span>Secured real time</span>
              <span class="flex">
                <ClockIcon className="w-6 h-6 text-gray-800 fill-[#7E2CFF] dark:text-white" />
                <span>Peek Time</span>
              </span>
            </div>
          </div>

          <button id="chat-btn" on:click={() => displayPage('chat')} class="start-button">
            <ChatIcon className="w-[34px] h-[34px] text-gray-800 dark:text-white" />
            <span>Start Conversation</span>
          </button>
        </div>

        <p class=" invisible">Or Here’s a few quick way to connect with us.</p>
        <button id="form-btn" on:click={() => displayPage('contact')} class="connect invisible">
          <span class="connect-icon">
            <!-- <svg><use xlink:href="./symbols.svg?lang.svg#connect" /></svg> -->
          </span>
          <span class="text">Connect with us</span>

          <!-- <svg><use xlink:href="./symbols.svg?lang.svg#arrow_right" /></svg> -->
        </button>
      </div>

      <div class={`${displayPart.chat ? 'block' : 'hidden'} gfc-chat-box`}>
        <div class="chat-box-header">
          <div class="box-details">
            <span class="">
              <img src="/imgs/support-chat/union.png" alt="" class="" />
              <span class={`${adminOnlineStatus ? 'online' : 'offline'}`} />
            </span>
            <div class="box-info">
              <span class="info">GoodFriends usual reply time</span>

              <span class="time">
                <ClockIcon className="w-[24px] h-[24px] text-gray-800 dark:text-white" />
                <span>2 min</span></span
              >
            </div>
          </div>
          <div class="mt-2 text-sm opacity-50 text-white">
            This is Private Message, Between You And Buddy.<br /> This Chat is end to end encrypted...
          </div>
        </div>
        <form on:submit|preventDefault={handleMessage}>
          <div class="chat-message-area">
            <div class="conversations">
              <div bind:this={chatMessages} class="flex custom-scroll pr-1 flex-col h-full overflow-x-auto mb-4 smoo">
                <div class="flex flex-col h-full">
                  <div class="flex flex-col">
                    {#each messages as { role, room, ...rest }}
                      <Message {...rest} isSelf={role == 'customer' ? true : false} />
                    {/each}
                  </div>
                </div>
              </div>
            </div>
            <div class={`${chatStart ? 'hidden' : 'block'}`}>
              <button class={`start-button`} on:click={onStartChat}>
                <span>
                  Say Hello to the agent
                  <font size="5"> 👋 </font>
                </span>
              </button>
            </div>
            <div class={`message-send-btn ${chatStart ? 'block' : 'hidden'}`}>
              <div class="relative">
                <input
                  type="text"
                  placeholder="Type here something..."
                  name="message"
                  bind:value={messageValue}
                  on:keydown={(e) => e.key === 'Enter' && e.preventDefault()}
                />
                <Button disabled={isSending} bind:ref={sendButton} class="send-btn">
                  <PaperPlaneIcon className="w-[24px] h-[24px] text-gray-800 dark:text-white rotate-45 ml-1 mb-1" />
                </Button>
                <FileInput
                  on:change={handleMessage}
                  accept="image/*"
                  class="absolute right-20 top-4"
                  bind:input={fileValue}
                >
                  <ImageIcon className="w-[30px] h-[30px]" />
                </FileInput>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="gfc-footer">
      <span>Powered by</span>
      <img src="/imgs/support-chat/chat-logo.png" alt="" class="" />
    </div>
    <div class="shape-footer" />
  </div>
  <div
    class="gfc-open bottom-[80px] md:bottom-[10px] z-[999999995] {$globalStore.chatOpen
      ? 'right-[15px] md:right-[320px]'
      : 'right-[15px] md:right-[40px]'}"
    on:click={toggleChat}
  >
    {#if $globalStore.supportChatOpen}
      <TopArrowIcon className={`transition-all w-[16px] h-[16px] text-gray-800 dark:text-white`} />
    {:else}
      <svg class="icon" width="30" height="30" viewBox="0 0 20 20" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.35547 1.97266C11.8755 1.83657 13.9003 2.76105 15.4297 4.7461C16.2233 5.90958 16.6465 7.19864 16.6992 8.61329C17.353 8.6877 17.7762 9.03926 17.9687 9.66797C17.9948 11.2044 17.9948 12.7409 17.9687 14.2774C17.828 14.8478 17.4699 15.1929 16.8945 15.3125C16.3602 15.319 15.8263 15.3386 15.293 15.3711C14.1159 16.8845 12.5664 17.7504 10.6445 17.9688C9.96758 17.9883 9.29051 17.9948 8.61328 17.9883C8.61328 17.5325 8.61328 17.0768 8.61328 16.6211C9.2384 16.6276 9.8634 16.6211 10.4883 16.6016C11.8731 16.4464 13.0254 15.8539 13.9453 14.8242C13.9467 13.4946 13.9727 12.1665 14.0234 10.8398C14.0841 10.5622 14.1883 10.3018 14.3359 10.0586C14.6354 9.6159 14.9349 9.17317 15.2344 8.73047C15.2683 6.92981 14.5717 5.47801 13.1445 4.37501C11.5122 3.24976 9.76746 3.04143 7.91016 3.75001C5.93742 4.67961 4.85668 6.23563 4.66797 8.41797C4.66613 8.52715 4.68566 8.63129 4.72656 8.73047C5.12199 9.28247 5.48656 9.8554 5.82031 10.4492C5.8907 10.6397 5.94277 10.835 5.97656 11.0352C6.00262 12.2982 6.00262 13.5612 5.97656 14.8242C5.92148 15.0328 5.79777 15.1825 5.60547 15.2734C4.7616 15.3372 3.91527 15.3503 3.06641 15.3125C2.49104 15.1929 2.13297 14.8478 1.99219 14.2774C1.96614 12.7409 1.96614 11.2044 1.99219 9.66797C2.18472 9.03926 2.6079 8.6877 3.26172 8.61329C3.38225 6.09461 4.50203 4.17407 6.62109 2.85157C7.47566 2.36483 8.38711 2.07186 9.35547 1.97266Z"
          fill="#ffffff"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.90234 4.27734C11.14 4.28453 12.1946 4.72074 13.0664 5.58594C12.825 5.83391 12.5776 6.0748 12.3242 6.30859C11.2324 5.31555 9.99543 5.0877 8.61328 5.625C8.24676 5.79516 7.92125 6.02301 7.63672 6.30859C7.38336 6.0748 7.13598 5.83391 6.89453 5.58594C7.73039 4.76434 8.73301 4.32812 9.90234 4.27734Z"
          fill="#ffffff"
        />
      </svg>
    {/if}
  </div>
</div>
