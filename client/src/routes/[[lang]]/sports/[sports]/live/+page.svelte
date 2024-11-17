<script>
  import globalStore from '@store/globalStore';

  import { LL } from '@src/i18n/i18n-svelte';

  import { page } from '$app/stores';

  import { clearSportsName } from '$lib/utils/common';

  import Filter from '@components/filter/filter.svelte';
  import SportsBet from '@components/sports/sportsBet.svelte';
  import BreadCrumb from '@components/breadCrumb/breadCrumb.svelte';

  $: isLoggedIn = $globalStore.userDetail;
  $: sportsName = $page.params.sports;

  let title = 'Live';

  let breadCrumbPages = [];
  let filterOptions = [];

  const liveSportsItems = [
    {
      type: 'Soccer',
      id: 0,
      timeData: {
        time: '15:31',
        date: '27 Feb'
      },
      content: 'ITALY - PREMIER LEAGUE >',
      teams: {
        team1: {
          title: 'Sevilia',
          image: '/imgs/sevilia.svg'
        },
        team2: {
          title: 'Atletico Madrid',
          image: '/imgs/atletico.svg'
        }
      },
      bet: {
        first: '5.5',
        x: '3.6',
        second: '1.7'
      },
      handicap: {
        first: {
          subTitle: '+0.75',
          title: '1.9'
        },
        second: {
          subTitle: '-0.75',
          title: '1.7'
        }
      },
      total: [
        {
          subTitle: '2.25',
          title: '2.0'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '2.0'
        }
      ]
    },
    {
      type: 'Soccer',
      id: 1,
      timeData: {
        time: '15:31',
        date: '27 Feb'
      },
      content: 'ITALY - PREMIER LEAGUE >',
      teams: {
        team1: {
          title: 'Torino',
          image: '/imgs/sevilia.svg'
        },
        team2: {
          title: 'Inter Milan',
          image: '/imgs/atletico.svg'
        }
      },
      bet: {
        first: '5.5',
        x: '3.6',
        second: '1.7'
      },
      handicap: {
        first: {
          subTitle: '+0.75',
          title: '1.9'
        },
        second: {
          subTitle: '-0.75',
          title: '1.7'
        }
      },
      total: [
        {
          subTitle: '2.25',
          title: '2.0'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '2.0'
        }
      ]
    },
    {
      type: 'Esports',
      id: 2,
      timeData: {
        time: '15:31',
        date: '27 Feb'
      },
      content: 'Esports - PREMIER LEAGUE >',
      teams: {
        team1: {
          title: 'Torino',
          image: '/imgs/sevilia.svg'
        },
        team2: {
          title: 'Inter Milan',
          image: '/imgs/atletico.svg'
        }
      },
      bet: {
        first: '5.5',
        x: '3.6',
        second: '1.7'
      },
      handicap: {
        first: {
          subTitle: '+0.75',
          title: '1.9'
        },
        second: {
          subTitle: '-0.75',
          title: '1.7'
        }
      },
      total: [
        {
          subTitle: '2.25',
          title: '2.0'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '2.0'
        }
      ]
    },
    {
      type: 'Esports',
      id: 2,
      timeData: {
        time: '15:31',
        date: '27 Feb'
      },
      content: 'Esports - PREMIER LEAGUE >',
      teams: {
        team1: {
          title: 'Torino',
          image: '/imgs/sevilia.svg'
        },
        team2: {
          title: 'Inter Milan',
          image: '/imgs/atletico.svg'
        }
      },
      bet: {
        first: '5.5',
        x: '3.6',
        second: '1.7'
      },
      handicap: {
        first: {
          subTitle: '+0.75',
          title: '1.9'
        },
        second: {
          subTitle: '-0.75',
          title: '1.7'
        }
      },
      total: [
        {
          subTitle: '2.25',
          title: '2.0'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '2.0'
        }
      ]
    },
    {
      type: 'Tennis',
      id: 2,
      timeData: {
        time: '15:31',
        date: '27 Feb'
      },
      content: 'Tennis - PREMIER LEAGUE >',
      teams: {
        team1: {
          title: 'Torino',
          image: '/imgs/sevilia.svg'
        },
        team2: {
          title: 'Inter Milan',
          image: '/imgs/atletico.svg'
        }
      },
      bet: {
        first: '5.5',
        x: '3.6',
        second: '1.7'
      },
      handicap: {
        first: {
          subTitle: '+0.75',
          title: '1.9'
        },
        second: {
          subTitle: '-0.75',
          title: '1.7'
        }
      },
      total: [
        {
          subTitle: '2.25',
          title: '2.0'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '2.0'
        }
      ]
    },
    {
      type: 'Basketball',
      id: 2,
      timeData: {
        time: '15:31',
        date: '27 Feb'
      },
      content: 'Basketball - PREMIER LEAGUE askdaksdjakdjasjkd >',
      teams: {
        team1: {
          title: 'Torino',
          image: '/imgs/sevilia.svg'
        },
        team2: {
          title: 'Inter Milan',
          image: '/imgs/atletico.svg'
        }
      },
      bet: {
        first: '5.5',
        x: '3.6',
        second: '1.7'
      },
      handicap: {
        first: {
          subTitle: '+0.75',
          title: '1.9'
        },
        second: {
          subTitle: '-0.75',
          title: '1.7'
        }
      },
      total: [
        {
          subTitle: '2.25',
          title: '2.0'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '2.0'
        }
      ]
    },
    {
      type: 'Rugby',
      id: 2,
      timeData: {
        time: '15:31',
        date: '27 Feb'
      },
      content: 'Rugby - PREMIER LEAGUE >',
      teams: {
        team1: {
          title: 'Torino',
          image: '/imgs/sevilia.svg'
        },
        team2: {
          title: 'Inter Milan',
          image: '/imgs/atletico.svg'
        }
      },
      bet: {
        first: '5.5',
        x: '3.6',
        second: '1.7'
      },
      handicap: {
        first: {
          subTitle: '+0.75',
          title: '1.9'
        },
        second: {
          subTitle: '-0.75',
          title: '1.7'
        }
      },
      total: [
        {
          subTitle: '2.25',
          title: '2.0'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '2.0'
        }
      ]
    },
    {
      type: 'Cricket',
      id: 2,
      timeData: {
        time: '15:31',
        date: '27 Feb'
      },
      content: 'Cricket - PREMIER LEAGUE >',
      teams: {
        team1: {
          title: 'Torino',
          image: '/imgs/sevilia.svg'
        },
        team2: {
          title: 'Inter Milan',
          image: '/imgs/atletico.svg'
        }
      },
      bet: {
        first: '5.5',
        x: '3.6',
        second: '1.7'
      },
      handicap: {
        first: {
          subTitle: '+0.75',
          title: '1.9'
        },
        second: {
          subTitle: '-0.75',
          title: '1.7'
        }
      },
      total: [
        {
          subTitle: '2.25',
          title: '2.0'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '1.8'
        },
        {
          subTitle: '2.25',
          title: '2.0'
        }
      ]
    }
  ];

  $: if (sportsName) {
    breadCrumbPages = [
      {
        name: 'Home',
        route: '/'
      },
      {
        name: 'Sports',
        route: `/sports/${sportsName}`
      }
    ];

    filterOptions = [
      {
        label: 'Highlights',
        to: `/sports/${sportsName}`
      },
      {
        label: 'Live',
        to: `/sports/${sportsName}/live`
      },
      {
        label: 'League',
        to: `/sports/${sportsName}/league`
      }
    ];
  }
</script>

<main class="w-full py-[27px] md:pl-[30px] md:pr-[30px]" id="main">
  <div class="relative container-main">
    <div class="pl-[15px] pr-[15px] md:pl-[0px] md:pr-[0px]">
      <BreadCrumb pages={breadCrumbPages} current={title} />
    </div>

    <div class="relative w-full hidden md:flex mt-10">
      <img
        class="w-full min-h-[260px] object-bottom max-h-[320px] object-cover rounded-[14px]"
        src={`/imgs/banners/${sportsName}.png`}
        alt=""
      />
      <div class="absolute left-0 top-0 w-full h-full bg-black21 rounded-[33px]" />

      <div class="absolute left-[47px] top-[50%] translate-y-[-50%]">
        <div class="flex flex-col mt-[65px] w-full max-w-[530px]">
          <h4 class="text-3xl mb-2 text-white font-semibold"><span class="sports-name">{clearSportsName(sportsName)}</span> Odds</h4>
          <Filter filters={filterOptions} />
        </div>
      </div>
    </div>

    <div class="md:px-0 px-[15px]">
      <SportsBet sportItems={liveSportsItems} title="Highlights" seeAll={true} />
    </div>
  </div>
</main>
