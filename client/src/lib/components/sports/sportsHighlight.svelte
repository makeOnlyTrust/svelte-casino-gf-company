<script>
  import { LL } from '@src/i18n/i18n-svelte';

  import globalStore from '@store/globalStore';

  import SportCheckbox from './sportCheckbox.svelte';
  import Spinner from '../spinner/spinner.svelte';

  import { convertToTimezone } from './../../utils/common.js';

  export let sportsName;
  export let sportItems;
  export let activeTab;
  export let title;
  export let oddNames;
  export let seeAll;
  export let filter;
  export let timestamp;
  export let loader;

  $: chatOpen = $globalStore.chatOpen;

  $: dynamicSportItems = sportItems; // use dynamicSportItems as dynamicArray
  let oddNameArr = [];

  const oddTitles = {
    'Match Winner': '',
    '3Way Result': '',
    'Home/Away': 'Home/Away',
    Handicap: $LL.HANDICAP(),
    'Total - Home': $LL.TOTAL(),
    'Over/Under': 'Over/Under',
    'Odd/Even': 'Odd/Even'
  };

  $: if (oddNames) {
    oddNameArr = [];
    for (const [key, value] of Object.entries(oddNames)) {
      if (key === 'odd1' || key === 'odd2' || key === 'odd3') {
        if (value !== '') {
          oddNameArr.push(value);
        }
      }
    }
  }

  const addBettingCard = (leagueId, matchId, matchA, matchB, oddId, oddName, subOddName, oddTarget, oddValue) => {
    let bettingCards = [];

    if ($globalStore.sportsbetSlipMode === 'single') {
      bettingCards = [...$globalStore.sportsSingleBettingCards];
    } else {
      bettingCards = [...$globalStore.sportsMultipleBettingCards];
    }

    const cardIndex = bettingCards.findIndex((ele) => {
      return (
        ele.leagueId === leagueId &&
        ele.matchId === matchId &&
        ele.oddId === oddId &&
        ele.subOddName === subOddName &&
        ele.oddTarget === oddTarget
      );
    });

    if (!$globalStore.betSlip) {
      globalStore.toggleItem('betSlip', true);
    }

    if (cardIndex !== -1) {
      bettingCards.splice(cardIndex, 1);

      if ($globalStore.sportsbetSlipMode === 'single') {
        globalStore.toggleItem('sportsSingleBettingCards', bettingCards);
      } else {
        globalStore.toggleItem('sportsMultipleBettingCards', bettingCards);
      }
    } else {
      if ($globalStore.sportsbetSlipMode === 'single') {
        globalStore.toggleItem('sportsSingleBettingCards', [
          ...$globalStore.sportsSingleBettingCards,
          {
            sportsName,
            matchId,
            leagueId,
            matchA,
            matchB,
            oddId,
            oddName,
            subOddName,
            oddTarget,
            oddValue,
            bettingAmount: 0
          }
        ]);
      } else {
        const matchIndex = bettingCards.findIndex((ele) => {
          return ele.matchId === matchId;
        });

        if (matchIndex === -1) {
          globalStore.toggleItem('sportsMultipleBettingCards', [
            ...$globalStore.sportsMultipleBettingCards,
            {
              sportsName,
              matchId,
              leagueId,
              matchA,
              matchB,
              oddId,
              oddName,
              subOddName,
              oddTarget,
              oddValue
            }
          ]);
        }
      }
    }
  };
</script>

<div class="w-full flex flex-col items-start gap-[15px] mt-[37px]">
  <div class="w-full flex items-center justify-between">
    {#if title}
      <h6 class="font-semibold text-xl gradient-text-white2 main">{title}</h6>
    {/if}
  </div>
  <div class="w-full flex flex-col gap-[15px] mt-[5px]">
    {#if loader}
      <Spinner />
    {/if}
    {#if dynamicSportItems.length === 0}
      <div class="w-full h-full relative">
        <div class="flex flex-col items-center">
          <img src="/imgs/sports/odd_not_found.png" alt="not found" />
          <p class="text-[#FFFFFF4D] text-xl">No Odds found</p>
        </div>
      </div>
    {:else}
      {#each dynamicSportItems as data, indexMain}
        <div class="w-full bg-white dark:bg-blackDark px-[13px] pt-[13px] pb-[11px] rounded-[7px]">
          <div
            class="w-full grid gap-[5px] md:gap-[15px] {chatOpen
              ? 'xl:grid-cols-[450px,1fr]'
              : 'lg:grid-cols-[450px,1fr]'}"
          >
            <a
              href="/sports/{sportsName}/{data.league_name.replace(/\s+/g, '-')}/{data.id}"
              class="flex flex-col md:flex-row md:items-center"
            >
              <div
                class="flex md:flex-col mb-3 md:mb-0 items-center gap-[4px] pr-[10px] border-r border-grayLight dark:border-r-white9 mr-[10px]"
              >
                <p class="min-w-max text-xs sm:text-base font-medium text-grayDark dark:text-grayLight">
                  {convertToTimezone(data.formatted_date, data.time)[1]}
                </p>
                <p class="min-w-max text-xs sm:text-base font-medium text-black dark:text-grayDark2">
                  {convertToTimezone(data.formatted_date, data.time)[0]}
                </p>
              </div>
              <div class="flex flex-col gap-[12px] md:gap-[20px]">
                <div class="flex items-center gap-[5px]">
                  <img
                    class="w-[14px] sm:w-[16px] mb-1"
                    src={data.league_url ? data.league_url : '/imgs/global.svg'}
                    alt="global"
                  />
                  <p class="text-xs sm:text-sm uppercase font-medium text-grayDark2">{data.league_name}</p>
                </div>
                <div class="flex items-center gap-[7px] sm:gap-[15px]">
                  <div class="flex items-center gap-[6px] sm:gap-[10px]">
                    <img
                      class="w-[22px] sm:w-[27px]"
                      src={data.matchA.url ? data.matchA.url : '/imgs/global.svg'}
                      alt="image"
                    />
                    <p class="text-sm sm:text-base font-bold text-black dark:text-grayLight">{data.matchA.name}</p>
                  </div>
                  <p class="text-sm font-normal text-grayDark2">{$LL.VS()}</p>
                  <div class="flex items-center gap-[6px] sm:gap-[10px]">
                    <img
                      class="w-[22px] sm:w-[27px]"
                      src={data.matchB.url ? data.matchB.url : '/imgs/global.svg'}
                      alt="image"
                    />
                    <p class="text-sm sm:text-base font-bold text-black dark:text-grayLight">{data.matchB.name}</p>
                  </div>
                </div>
              </div>
            </a>
            <div
              class="border-t border-t-grayLight dark:border-t-white11 mt-[10px] sm:mt-[15px] md:mt-[0px] py-[15px] md:border-none md:py-[2px] flex cursor-draggable items-center gap-[10px] dragable overflow-auto scrollbar-hidden pl-0.5"
            >
              <div class="flex items-center gap-[10px]">
                {#each oddNameArr as oddName, key}
                  {#if oddName === 'Match Winner' || oddName === '3Way Result' || oddName.includes('Home/Away')}
                    {#if !data.odds.some((odd) => odd.value === oddName)}
                      <div class="flex items-center gap-[5px]">
                        <SportCheckbox title={oddName.includes('Home/Away') ? 'HOME' : '1'} value="" disabled />
                        {#if oddName !== 'Home/Away'}
                          <SportCheckbox title="x" value="" disabled />
                        {/if}
                        <SportCheckbox title={oddName.includes('Home/Away') ? 'HOME' : '2'} value="" disabled />
                      </div>
                    {:else}
                      {#each data.odds as odd, index}
                        {#if odd.value === oddName && odd.bookmakers[0] && odd.bookmakers[0].odds}
                          <div class="flex items-center gap-[5px]">
                            <SportCheckbox
                              title={oddName.includes('Home/Away') ? 'HOME' : '1'}
                              disabled={!odd.bookmakers[0].odds[0]}
                              odd={odd.bookmakers[0].odds[0]}
                              cardData={{
                                sportsName: sportsName,
                                matchId: data.id,
                                leagueId: data.league_id,
                                matchA: data.matchA,
                                matchB: data.matchB,
                                oddId: odd.id,
                                oddName: odd.value,
                                subOddName: ''
                              }}
                              onClick={addBettingCard}
                            />
                            {#if oddName.includes('Home/Away')}
                              <SportCheckbox
                                title="AWAY"
                                disabled={!odd.bookmakers[0].odds[1]}
                                odd={odd.bookmakers[0].odds[1]}
                                cardData={{
                                  sportsName: sportsName,
                                  matchId: data.id,
                                  leagueId: data.league_id,
                                  matchA: data.matchA,
                                  matchB: data.matchB,
                                  oddId: odd.id,
                                  oddName: odd.value,
                                  subOddName: ''
                                }}
                                onClick={addBettingCard}
                              />
                            {:else}
                              <SportCheckbox
                                title="x"
                                disabled={!odd.bookmakers[0].odds[1]}
                                odd={odd.bookmakers[0].odds[1]}
                                cardData={{
                                  sportsName: sportsName,
                                  matchId: data.id,
                                  leagueId: data.league_id,
                                  matchA: data.matchA,
                                  matchB: data.matchB,
                                  oddId: odd.id,
                                  oddName: odd.value,
                                  subOddName: ''
                                }}
                                onClick={addBettingCard}
                              />
                              <SportCheckbox
                                title="2"
                                disabled={!odd.bookmakers[0].odds[2]}
                                odd={odd.bookmakers[0].odds[2]}
                                cardData={{
                                  sportsName: sportsName,
                                  matchId: data.id,
                                  leagueId: data.league_id,
                                  matchA: data.matchA,
                                  matchB: data.matchB,
                                  oddId: odd.id,
                                  oddName: odd.value,
                                  subOddName: ''
                                }}
                                onClick={addBettingCard}
                              />
                            {/if}
                          </div>
                        {/if}
                      {/each}
                    {/if}
                  {/if}

                  {#if oddName.includes('Handicap')}
                    <div class="flex flex-col gap-[0px] items-center">
                      <p class="text-xs sm:text-sm font-bold text-grayDark2">
                        {oddTitles['Handicap']}
                      </p>
                      {#if !data.odds.some((odd) => odd.value === oddName)}
                        <div class="flex items-center gap-[5px]">
                          <SportCheckbox value="" disabled />
                          <SportCheckbox value="" disabled />
                        </div>
                      {:else}
                        {#each data.odds as odd, index}
                          {#if odd.value === oddName && odd.bookmakers[0] && odd.bookmakers[0].odds}
                            <div class="flex items-center gap-[5px]">
                              <SportCheckbox
                                titleColor={true}
                                disabled={!(odd.bookmakers[0].odds[0] && odd.bookmakers[0].odds[0].odds[0])}
                                additionalTitle={odd.bookmakers[0]?.odds[0]?.name}
                                odd={odd.bookmakers[0].odds[0]?.odds[0]}
                                cardData={{
                                  sportsName: sportsName,
                                  matchId: data.id,
                                  leagueId: data.league_id,
                                  matchA: data.matchA,
                                  matchB: data.matchB,
                                  oddId: odd.id,
                                  oddName: odd.value,
                                  subOddName: odd.bookmakers[0].odds[0]?.name
                                }}
                                onClick={addBettingCard}
                              />
                              <SportCheckbox
                                titleColor={true}
                                disabled={!(odd.bookmakers[0].odds[0] && odd.bookmakers[0].odds[0].odds[1])}
                                additionalTitle={odd.bookmakers[0]?.odds[0]?.name}
                                odd={odd.bookmakers[0]?.odds[0]?.odds[1]}
                                cardData={{
                                  sportsName: sportsName,
                                  matchId: data.id,
                                  leagueId: data.league_id,
                                  matchA: data.matchA,
                                  matchB: data.matchB,
                                  oddId: odd.id,
                                  oddName: odd.value,
                                  subOddName: odd.bookmakers[0].odds[0]?.name
                                }}
                                onClick={addBettingCard}
                              />
                            </div>
                          {/if}
                        {/each}
                      {/if}
                    </div>
                  {/if}

                  {#if oddName === 'Total - Home' || oddName === 'Over/Under' || oddName === 'Odd/Even'}
                    <div class="flex flex-col gap-[0px] items-center">
                      {#if oddName === 'Total - Home'}
                        <p class="text-xs sm:text-sm font-bold text-grayDark2">
                          {oddTitles[oddName]}
                        </p>
                      {/if}
                      {#if !data.odds.some((odd) => odd.value === oddName)}
                        <div class="flex items-center gap-[5px]">
                          {#if oddName === 'Total - Home'}
                            <SportCheckbox value="" disabled />
                            <SportCheckbox value="" disabled />
                            <SportCheckbox value="" disabled />
                            <SportCheckbox value="" disabled />
                          {:else}
                            <SportCheckbox title={oddName === 'Over/Under' ? 'OVER' : 'ODD'} value="" disabled />
                            <SportCheckbox title={oddName === 'Over/Under' ? 'UNDER' : 'EVEN'} value="" disabled />
                          {/if}
                        </div>
                      {:else}
                        {#each data.odds as odd, index}
                          {#if odd.value === oddName && odd.bookmakers[0] && odd.bookmakers[0].odds}
                            <div class="flex items-center gap-[5px]">
                              {#each odd.bookmakers[0].odds as bookmarker, bookmarkerIndex}
                                {#if bookmarkerIndex === 0 || bookmarkerIndex === 1}
                                  {#each bookmarker.odds.slice(0, 4) as subOdd}
                                    <SportCheckbox
                                      title={oddName === 'Over/Under' || oddName === 'Odd/Even' ? subOdd.name : ''}
                                      disabled={!(subOdd && subOdd.value)}
                                      additionalTitle={bookmarker.name}
                                      odd={subOdd}
                                      cardData={{
                                        sportsName: sportsName,
                                        matchId: data.id,
                                        leagueId: data.league_id,
                                        matchA: data.matchA,
                                        matchB: data.matchB,
                                        oddId: odd.id,
                                        oddName: odd.value,
                                        subOddName: bookmarker.name
                                      }}
                                      onClick={addBettingCard}
                                    />
                                  {/each}
                                {/if}
                              {/each}
                            </div>
                          {/if}
                        {/each}
                      {/if}
                    </div>
                  {/if}
                {/each}
              </div>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>
