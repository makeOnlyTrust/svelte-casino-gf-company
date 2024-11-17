<script>
  import SportsBet from '../../sports/sportsBet.svelte';
  import { LL, setLocale, locale } from '@src/i18n/i18n-svelte';

  export let odds;
  export let oddNames;

  const liveSportsTabs = [
    {
      title: 'SOCCER',
      key: 'soccer',
      image: '/imgs/sports/icons/soccer.svg',
    },
    {
      title: 'ESPORTS',
      key: 'esports',
      image: '/imgs/sports/icons/esports.svg',
    },
    {
      title: 'TENNIS',
      key: 'tennis',
      image: '/imgs/sports/icons/tennis.svg',
    },
    {
      title: 'BASKETBALL',
      key: 'basketball',
      image: '/imgs/sports/icons/basketball.svg',
      hide: 'mobile' // hide when taiiwindcss breakpoiint screen.sm
    },
    {
      title: 'RUGBY',
      key: 'rugby',
      image: '/imgs/sports/icons/rugby.svg',
      hide: 'mobile'
    },
    {
      title: 'RUGBY LEAGUE',
      key: 'rugby-league',
      image: '/imgs/sports/icons/rugby-league.svg',
      hide: 'mobile'
    },
    {
      title: 'AMERICAN FOOTBALL',
      key: 'american-football',
      image: '/imgs/sports/icons/american-football.svg',
      hide: 'mobile'
    },
    {
      title: 'BASEBALL',
      key: 'baseball',
      image: '/imgs/sports/icons/baseball.svg',
      hide: 'mobile'
    },
    {
      title: 'BOXING',
      key: 'boxing',
      image: '/imgs/sports/icons/boxing.svg',
      hide: 'mobile'
    },
    {
      title: 'DARTS',
      key: 'darts',
      image: '/imgs/sports/icons/dart.svg',
      hide: 'mobile'
    },
    {
      title: 'FUTSAL',
      key: 'futsal',
      image: '/imgs/sports/icons/futsal.svg',
      hide: 'mobile'
    },
    {
      title: 'GOLF',
      key: 'golf',
      image: '/imgs/sports/icons/golf.svg',
      hide: 'mobile'
    },
    {
      title: 'HANDBALL',
      key: 'handball',
      image: '/imgs/sports/icons/handball.svg',
      hide: 'mobile'
    },
    {
      title: 'HOCKEY',
      key: 'hockey',
      image: '/imgs/sports/icons/hockey.svg',
      hide: 'mobile'
    },
    {
      title: 'MMA',
      key: 'mma',
      image: '/imgs/sports/icons/mma.svg',
      hide: 'mobile'
    },
    {
      title: 'TABLE TENNIS',
      key: 'table-tennis',
      image: '/imgs/sports/icons/table-tennis.svg',
      hide: 'mobile'
    },
    {
      title: 'VOLLEYBALL',
      key: 'volleyball',
      image: '/imgs/sports/icons/volleyball.svg',
      hide: 'mobile'
    }
  ];
</script>

<SportsBet
  activeTab="soccer"
  sportTabs={liveSportsTabs}
  sportItems={odds}
  sportOddNames = {oddNames}
  title={$LL.MAIN_SPORTS()}
  seeAll={true}
  filter='scroll'
/>
