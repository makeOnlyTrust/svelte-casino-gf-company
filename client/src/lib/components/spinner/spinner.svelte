<style>
    @keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}

.spinner {

  margin: auto;
  height: 50%;
  width: 50%;
  border: 4px solid rgba(0, 174, 239, 0.2);
  border-top-color: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  animation: rotation 3s infinite linear;
}

.spinner-blue {
  border-top-color: rgba(0, 174, 239, 0.8);
}

.spinner-red {
  border-top-color: rgba(239, 71, 111, 0.8);
}

.spinner-green {
  border-top-color: rgba(52, 211, 153, 0.8);
}

.spinner-yellow {
  border-top-color: rgba(253, 203, 78, 0.8);
}

.spinner-purple {
  border-top-color: rgba(139, 92, 246, 0.8);
}

.spinner-orange {
  border-top-color: rgba(249, 169, 91, 0.8);
}

</style>

<div class="flex justify-center">
      <!-- <div class="flex justify-center items-center h-12 w-12 animate-spin">
        <div class="spinner spinner-blue border-blue-200"></div>
      </div>
      <div class="flex justify-center items-center h-12 w-12 animate-spin">
        <div class="spinner spinner-red border-red-200"></div>
      </div>
      <div class="flex justify-center items-center h-12 w-12 animate-spin">
        <div class="spinner spinner-green border-green-200"></div>
      </div> -->
      <div class="flex  items-center h-12 w-12 animate-spin">
        <div class="spinner spinner-yellow border-yellow-200"></div>
      </div>
      <!-- <div class="flex justify-center items-center h-12 w-12 animate-spin">
        <div class="spinner spinner-purple border-purple-200"></div>
      </div>
      <div class="flex justify-center items-center h-12 w-12 animate-spin">
        <div class="spinner spinner-orange border-orange-200"></div>
      </div> -->
</div>

