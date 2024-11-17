import { writable } from 'svelte/store';

const globalStore = writable({
  sidebar: false,
  chatOpen: false,
  supportChatOpen: false,
  betSlip: false,
  registrationStep: 1,
  registrationForm: false,
  loginForm: false,
  forgotPasswordStep: 1,
  forgotPasswordForm: false,
  darkMode: true,
  userDetail: null,
  depositModal: false,
  newDepositModal: false,
  newWithdrawModal: false,
  addAgentModal: false,
  promotionModal: false,
  spinner: false,
  isMobile: false,
  sportsbetSlipMode: 'single',
  sportsSingleBettingCards: [],
  sportsMultipleBettingCards: [],
  SportsSearch: '',
  SportsSearchStatus: false
});

const store = {
  subscribe: globalStore.subscribe,
  toggleItem: (item, value) => {
    globalStore.update((storeValues) => {
      return { ...storeValues, [item]: value };
    });
  },

  // 2024-01-12 jinowe Dynamically access nested properties of objects
  // ex) store.updateNestedProperty('userDetail.info.verify.email', value); 
  updateNestedProperty: (path, value) => {
    globalStore.update(storeValues => {
      const pathArray = path.split('.')

      const lastProperty = pathArray.pop()
      let current = storeValues
      for (const property of pathArray) {
        if (!current[property]) current[property] = {}
        current = current[property]
      }

      current[lastProperty] = value;

      return { ...storeValues }
    })
  }
};

export default store;
