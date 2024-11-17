<!-- 2024-01-12 jinowe timer component -->
<script>
    import { createEventDispatcher, onDestroy } from 'svelte';
    import toast from '@components/toast/toast';

    export let m = 0; // initial minutes
    export let s = 0; // initial seconds

    let totalSeconds = m * 60 + s;
    let timer;

    const dispatch = createEventDispatcher();
  
    const startTimer = () => {
      timer = setInterval(() => {
        totalSeconds -= 1;
        if (totalSeconds <= 0) {
            clearInterval(timer);
            toast.error("Time is over.");
            clearInterval(timer);
            dispatch('timerEnd', { finished: true });
        }
      }, 1000);
    }

    export const stopTimer = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }
  
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  
    // Clean up timer when component is destroyed
    onDestroy(() => {
      if (timer) {
        clearInterval(timer);
      }
    });

    startTimer()
  </script>
  
  <p>{formatTime(totalSeconds)}</p>