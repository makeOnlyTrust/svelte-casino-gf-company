<script>
    import Btn from '@components/btn.svelte';
    import { postMinigameBet, postMinigameBetRate } from "@apis/minigame.js";
    import globalStore from '@store/globalStore';
    import toast from "@components/toast/toast.js";
    import { getCryptoRate } from "@apis/crypto.js";

    export let type;
    export let gameId;

    let OddEven = '';
    let UnderOver = '';
    let POddEven = '';
    let PUnderOver = '';
    let ThreeFour = '';
    let LeftRight = '';
    let BigMiddleSmall = '';
    let luckyNumber = '';

    let section = '';

    let amount = 0;
    let betRate = 0;

    $: detail = $globalStore.userDetail;
    let currentCurrecnyImage = '';
    let currentCurrecnySymbol = '';
    let cryptoRate = '';
    let cryproRate5000 = '';
    $:{
        OddEven
        UnderOver
        POddEven
        PUnderOver
        ThreeFour
        LeftRight
        BigMiddleSmall
        luckyNumber
        section
        ChangeBetRate();
        currentCurrecnyImage = detail?.currentCurrecnyImage ?? '';
        currentCurrecnySymbol = detail?.currentCurrecnySymbol ?? '';
    }
    $:{
        if (currentCurrecnySymbol !== '') {
            (async () => {
                const data = await getCryptoRate({ currencySymbol: currentCurrecnySymbol });
                if (!data.rate) {
                    cryptoRate = 1;
                    cryproRate5000 = 5000;
                } else {
                    cryptoRate = data.rate;
                    cryproRate5000 = (5000 / cryptoRate).toFixed(6);
                }
                amount = 0;
            })();
        }
    }

    const ChangeNumber = (d) => {
        if (isNaN(d.target.valueAsNumber)) {
            luckyNumber = ''
            return;
        }
        luckyNumber = Math.min(Math.max(d.target.valueAsNumber, 1), 70);
        d.target.valueAsNumber = luckyNumber;
    }

    const ChangeAmount = (d) => {
        if (isNaN(d.target.valueAsNumber)) {
            amount = 0
            return;
        }
        // fix min max betting amount
        // amount = Math.min(Math.max(d.target.valueAsNumber, 5_000), 50_000);
        amount = d.target.valueAsNumber;
        d.target.valueAsNumber = amount;
    }
    const ChangeBetRate = async (d) => {
        const rate = await postMinigameBetRate({
            gameId: gameId,
            bet: {
                OddEven: OddEven ?? '',
                UnderOver: UnderOver ?? '',
                POddEven: POddEven ?? '',
                PUnderOver: PUnderOver ?? '',
                ThreeFour: ThreeFour ?? '',
                LeftRight: LeftRight ?? '',
                BigMiddleSmall: BigMiddleSmall ?? '',
                luckyNumber: luckyNumber ?? '',
                section: section ?? '',
            }
        });
        betRate = `x${ rate }`;
    }
    const betClearPowerBall = () => {
        // OddEven = '';
        // UnderOver = '';
        POddEven = '';
        PUnderOver = '';
        ThreeFour = '';
        LeftRight = '';
        BigMiddleSmall = '';
        luckyNumber = '';
        section = '';
    }
    const betClearRegularBall = () => {
        OddEven = '';
        UnderOver = '';
        // POddEven = '';
        // PUnderOver = '';
        ThreeFour = '';
        LeftRight = '';
        BigMiddleSmall = '';
        luckyNumber = '';
        section = '';
    }

    const betClear = () => {
        OddEven = '';
        UnderOver = '';
        POddEven = '';
        PUnderOver = '';
        ThreeFour = '';
        LeftRight = '';
        BigMiddleSmall = '';
        luckyNumber = '';
        section = '';
    }

    const Betting = async () => {
        // OddEven !== '' && console.log(`OddEven : ${ OddEven }`);
        // UnderOver !== '' && console.log(`UnderOver : ${ UnderOver }`);
        // POddEven !== '' && console.log(`POddEven : ${ POddEven }`);
        // PUnderOver !== '' && console.log(`PUnderOver : ${ PUnderOver }`);
        // ThreeFour !== '' && console.log(`ThreeFour : ${ ThreeFour }`);
        // LeftRight !== '' && console.log(`LeftRight : ${ LeftRight }`);
        // BigMiddleSmall !== '' && console.log(`BigMiddleSmall : ${ BigMiddleSmall }`);
        // luckyNumber !== '' && console.log(`luckyNumber : ${ luckyNumber }`);
        // section !== '' && console.log(`section : ${ section }`);
        // console.log(`amount : ${ amount }`);
        // console.log("d");
        if (amount <= 0 || isNaN(Number(amount))) {
            toast.error("Check amount please.");
            return;
        }

        const userId = $globalStore.userDetail ? $globalStore.userDetail._id : '';

        const res = await postMinigameBet(
            userId,
            gameId,
            amount,
            '',
            {
                OddEven: OddEven ?? '',
                UnderOver: UnderOver ?? '',
                POddEven: POddEven ?? '',
                PUnderOver: PUnderOver ?? '',
                ThreeFour: ThreeFour ?? '',
                LeftRight: LeftRight ?? '',
                BigMiddleSmall: BigMiddleSmall ?? '',
                luckyNumber: luckyNumber ?? '',
                section: section ?? '',
            }
        )
        if (res.success) {
            toast.success('Betting Success.');
        } else {
            toast.error(res.msg.message);
        }
    }
</script>
<style>

</style>
<div class="w-full flex items-center gap-[10px] p-[15px] bg-grayLight2 dark:bg-black21 justify-center flex-col">
    <div class="w-full flex gap-[20px] max-lg:flex-col">
        <div class="w-full max-lg:w-full flex flex-col bg-grayLight2 dark:bg-black21 text-sm font-medium text-black50 dark:text-white50 capitalize group-hover:text-black dark:group-hover:text-white gap-[10px] max-lg:mb-[10px]">
            {#if type === "powerball"}
                <!--                "powerball"-->
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (POddEven==='odd') {
                                    POddEven='';
                                } else {
                                    betClearRegularBall();
                                    POddEven='odd';
                                }
                            }}
                            label={'(P)Odd'}
                            value={'(P)Odd'}
                            radioGroup="POddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {POddEven==='odd' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (POddEven==='even') {
                                    POddEven='';
                                } else {
                                    betClearRegularBall();
                                    POddEven='even';
                                }
                            }}
                            label={'(P)Even'}
                            value={'(P)Even'}
                            radioGroup="POddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {POddEven==='even' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (PUnderOver==='under') {
                                    PUnderOver='';
                                } else {
                                    betClearRegularBall();
                                    PUnderOver='under';
                                }
                            }}
                            label={'(P)Under'}
                            value={'(P)Under'}
                            radioGroup="PUnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {PUnderOver==='under' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (PUnderOver==='over') {
                                    PUnderOver='';
                                } else {
                                    betClearRegularBall();
                                    PUnderOver='over';
                                }
                            }}
                            label={'(P)Over'}
                            value={'(P)Over'}
                            radioGroup="PUnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {PUnderOver==='over' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (OddEven==='odd') {
                                    OddEven='';
                                } else {
                                    betClearPowerBall();
                                    OddEven='odd';
                                }
                            }}
                            label={'Odd'}
                            value={'Odd'}
                            radioGroup="OddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {OddEven==='odd' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (OddEven==='even') {
                                    OddEven='';
                                } else {
                                    betClearPowerBall();
                                    OddEven='even';
                                }
                            }}
                            label={'Even'}
                            value={'Even'}
                            radioGroup="OddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {OddEven==='even' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (UnderOver==='under') {
                                    UnderOver='';
                                } else {
                                    betClearPowerBall();
                                    UnderOver='under';
                                }
                            }}
                            label={'Under'}
                            value={'Under'}
                            radioGroup="UnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {UnderOver==='under' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (UnderOver==='over') {
                                    UnderOver='';
                                } else {
                                    betClearPowerBall();
                                    UnderOver='over';
                                }
                            }}
                            label={'Over'}
                            value={'Over'}
                            radioGroup="UnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {UnderOver==='over' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (BigMiddleSmall==='소') {
                                    BigMiddleSmall='';
                                } else {
                                    betClear();
                                    BigMiddleSmall='소';
                                }
                            }}
                            label={"소(15~64)\n[x2.85]"}
                            value={"소"}
                            radioGroup="BigMiddleSmallTab"
                            variant="radio"
                            className="w-full bg-white3 {BigMiddleSmall==='소' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (BigMiddleSmall==='중') {
                                    BigMiddleSmall='';
                                } else {
                                    betClear();
                                    BigMiddleSmall='중';
                                }
                            }}
                            label={'중(65~80)\n[x2.5]'}
                            value={'중'}
                            radioGroup="BigMiddleSmallTab"
                            variant="radio"
                            className="w-full bg-white3 {BigMiddleSmall==='중' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (BigMiddleSmall==='대') {
                                    BigMiddleSmall='';
                                } else {
                                    betClear();
                                    BigMiddleSmall='대';
                                }
                            }}
                            label={'대(81~130)\n[2.85]'}
                            value={'대'}
                            radioGroup="BigMiddleSmallTab"
                            variant="radio"
                            className="w-full bg-white3 {BigMiddleSmall==='대' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (section==='A') {
                                    section='';
                                } else {
                                    betClear();
                                    section='A';
                                }
                            }}
                            label={'A(15~35)\n[x50]'}
                            value={'A'}
                            radioGroup="SectionTab"
                            variant="radio"
                            className="w-full bg-white3 {section==='A' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (section==='B') {
                                    section='';
                                } else {
                                    betClear();
                                    section='B';
                                }
                            }}
                            label={'B(36~49)\n[x11]'}
                            value={'B'}
                            radioGroup="SectionTab"
                            variant="radio"
                            className="w-full bg-white3 {section==='B' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (section==='C') {
                                    section='';
                                } else {
                                    betClear();
                                    section='C';
                                }
                            }}
                            label={"C(50~57)\n[x8.5]"}
                            value={"C"}
                            radioGroup="SectionTab"
                            variant="radio"
                            className="w-full bg-white3 {section==='C' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (section==='D') {
                                    section='';
                                } else {
                                    betClear();
                                    section='D';
                                }
                            }}
                            label={"D(58~65)\n[5.5]"}
                            value={"D"}
                            radioGroup="SectionTab"
                            variant="radio"
                            className="w-full bg-white3 {section==='D' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (section==='E') {
                                    section='';
                                } else {
                                    betClear();
                                    section='E';
                                }
                            }}
                            label={"E(66~78)\n[2.9]"}
                            value={"E"}
                            radioGroup="SectionTab"
                            variant="radio"
                            className="w-full bg-white3 {section==='E' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (section==='F') {
                                    section='';
                                } else {
                                    betClear();
                                    section='F';
                                }
                            }}
                            label={"F(79~130)\n[2.35]"}
                            value={"F"}
                            radioGroup="SectionTab"
                            variant="radio"
                            className="w-full bg-white3 {section==='F' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
            {:else if type === "ladder"}
                <!--                "ladder"-->
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (OddEven==='odd') {
                                    OddEven='';
                                } else {
                                    betClear();
                                    OddEven='odd';
                                }
                            }}
                            label={'Odd\n[x1.95]'}
                            value={'Odd'}
                            radioGroup="OddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {OddEven==='odd' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (OddEven==='even') {
                                    OddEven='';
                                } else {
                                    betClear();
                                    OddEven='even';
                                }
                            }}
                            label={'Even\n[x1.95]'}
                            value={'Even'}
                            radioGroup="OddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {OddEven==='even' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (LeftRight==='left') {
                                    LeftRight='';
                                } else {
                                    betClear();
                                    LeftRight='left';
                                }
                            }}
                            label={'left\n[x1.95]'}
                            value={'left'}
                            radioGroup="LeftRightTab"
                            variant="radio"
                            className="w-full bg-white3 {LeftRight==='left' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (LeftRight==='right') {
                                    LeftRight='';
                                } else {
                                    betClear();
                                    LeftRight='right';
                                }
                            }}
                            label={'right\n[x1.95]'}
                            value={'right'}
                            radioGroup="LeftRightTab"
                            variant="radio"
                            className="w-full bg-white3 {LeftRight==='right' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (ThreeFour==='three') {
                                    ThreeFour="";
                                } else {
                                    betClear();
                                    ThreeFour="three";
                                }
                            }}
                            label={'3\n[x1.95]'}
                            value={3}
                            radioGroup="ThreeFourTab"
                            variant="radio"
                            className="w-full bg-white3 {ThreeFour==='three' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (ThreeFour==='four') {
                                    ThreeFour='';
                                } else {
                                    betClear();
                                    ThreeFour="four";
                                }
                            }}
                            label={'4\n[x1.95]'}
                            value={4}
                            radioGroup="ThreeFourTab"
                            variant="radio"
                            className="w-full bg-white3 {ThreeFour==='four' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
            {:else if type === "keno" && gameId === "dh-keno"}
                <!--                "kenoV_2"-->
                <!--                <div class="w-full flex gap-[10px]">-->
                <!--                    <input-->
                <!--                            class={`w-full h-[50px] bg-white3 rounded-[9px] outline-none px-[23px] text-sm font-medium font-normal text-black dark:text-grayLight placeholder:text-grayDark4`}-->
                <!--                            type="number"-->
                <!--                            placeholder="Number here..."-->
                <!--                            on:input={ChangeNumber}-->
                <!--                            bind:value={luckyNumber}-->
                <!--                    />-->
                <!--                    &lt;!&ndash;                            on:focus={() => ("inputFocus = true")}&ndash;&gt;-->
                <!--                    &lt;!&ndash;                            on:focusout={() => ("inputFocus = false")}&ndash;&gt;-->
                <!--                </div>-->
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (POddEven==='odd') {
                                    POddEven='';
                                } else {
                                    betClear();
                                    POddEven='odd';
                                }
                            }}
                            label={'(P)Odd'}
                            value={'(P)Odd'}
                            radioGroup="POddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {POddEven==='odd' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (POddEven==='even') {
                                    POddEven='';
                                } else {
                                    betClear();
                                    POddEven='even';
                                }
                            }}
                            label={'(P)Even'}
                            value={'(P)Even'}
                            radioGroup="POddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {POddEven==='even' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (PUnderOver==='under') {
                                    PUnderOver='';
                                } else {
                                    betClear();
                                    PUnderOver='under';
                                }
                            }}
                            label={'(P)Under'}
                            value={'(P)Under'}
                            radioGroup="PUnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {PUnderOver==='under' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (PUnderOver==='over') {
                                    PUnderOver='';
                                } else {
                                    betClear();
                                    PUnderOver='over';
                                }
                            }}
                            label={'(P)Over'}
                            value={'(P)Over'}
                            radioGroup="PUnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {PUnderOver==='over' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (OddEven==='odd') {
                                    OddEven='';
                                } else {
                                    betClear();
                                    OddEven='odd';
                                }
                            }}
                            label={'Odd'}
                            value={'Odd'}
                            radioGroup="OddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {OddEven==='odd' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (OddEven==='even') {
                                    OddEven='';
                                } else {
                                    betClear();
                                    OddEven='even';
                                }
                        }}
                            label={'Even'}
                            value={'Even'}
                            radioGroup="OddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {OddEven==='even' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (UnderOver==='under') {
                                    UnderOver='';
                                } else {
                                    betClear();
                                    UnderOver='under';
                                }
                            }}
                            label={'Under'}
                            value={'Under'}
                            radioGroup="UnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {UnderOver==='under' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (UnderOver==='over') {
                                    UnderOver='';
                                } else {
                                    betClear();
                                    UnderOver='over';
                                }
                            }}
                            label={'Over'}
                            value={'Over'}
                            radioGroup="UnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {UnderOver==='over' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
            {:else if type === "keno" && gameId === "ntry-keno"}
                <!--                "keno"-->
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (OddEven==='odd') {
                                    OddEven='';
                                } else {
                                    betClear();
                                    OddEven='odd';
                                }
                            }}
                            label={'Odd\n[x1.95]'}
                            value={'Odd'}
                            radioGroup="OddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {OddEven==='odd' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (OddEven==='even') {
                                    OddEven='';
                                } else {
                                    betClear();
                                    OddEven='even';
                                }
                            }}
                            label={'Even\n[x1.95]'}
                            value={'Even'}
                            radioGroup="OddEvenTab"
                            variant="radio"
                            className="w-full bg-white3 {OddEven==='even' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
                <div class="w-full flex gap-[10px]">
                    <Btn
                            onClick={()=>{
                                if (UnderOver==='under') {
                                    UnderOver='';
                                } else {
                                    betClear();
                                    UnderOver='under';
                                }
                        }}
                            label={'Under\n[x1.95]'}
                            value={'Under'}
                            radioGroup="UnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {UnderOver==='under' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                    <Btn
                            onClick={()=>{
                                if (UnderOver==='over') {
                                    UnderOver='';
                                } else {
                                    betClear();
                                    UnderOver='over';
                                }
                        }}
                            label={'Over\n[x1.95]'}
                            value={'Over'}
                            radioGroup="UnderOverTab"
                            variant="radio"
                            className="w-full bg-white3 {UnderOver==='over' ? 'active' : ''} filter-btn whitespace-pre-wrap"
                    />
                </div>
            {/if}
        </div>
        <div class="w-full flex flex-col bg-grayLight2 dark:bg-black21 text-sm font-medium text-black50 dark:text-white50 capitalize group-hover:text-black dark:group-hover:text-white gap-[10px]">
            <div class="w-full flex gap-[10px]">
                <div class="flex items-center w-full min-w-[50%] h-[50px] bg-white5 rounded-[9px]">
                    <img width="30" class="w-full max-w-[30px] h-[30px] ml-[10px] rounded-full s-NFUdeFppHV8k"
                         src={currentCurrecnyImage} alt="ETH 0">
                    <input
                            class={`w-full h-[50px] bg-transparent outline-none pl-[10px] pr-[23px] text-sm font-medium font-normal text-black dark:text-grayLight placeholder:text-grayDark4`}
                            type="number"
                            placeholder="Betting Amount here..."
                            on:input={ChangeAmount}
                            bind:value={amount}
                    />
                </div>
                <!--                            on:focus={() => ("inputFocus = true")}-->
                <!--                            on:focusout={() => ("inputFocus = false")}-->
                <Btn
                        onClick={()=>{
                            amount/=2;
                            if (isNaN(amount)) {
                                amount = ''
                                return;
                            }
                            amount = amount;
                        }}
                        label={'/2'}
                        value={'/2'}
                        radioGroup="price"
                        variant="radio"
                        className="w-full hover:bg-primary filter-btn"
                />
                <Btn
                        onClick={()=>{
                            amount*=2;
                            if (isNaN(amount)) {
                                amount = ''
                                return;
                            }
                            amount = amount;
                        }}
                        label={'X2'}
                        value={'X2'}
                        radioGroup="price"
                        variant="radio"
                        className="w-full hover:bg-primary filter-btn"
                />
                <!--                <div class="flex justify-center items-center cursor-pointer w-[33.33%] h-[53px] rounded-[7px] px-[29px] border-[1.5px]">-->
                <!--                    /2-->
                <!--                </div>-->
                <!--                <div class="flex justify-center items-center cursor-pointer w-[33.33%] h-[53px] rounded-[7px] px-[29px] border-[1.5px]">-->
                <!--                    X2-->
                <!--                </div>-->
            </div>
            <div class="w-full flex gap-[10px]">
                <Btn
                        onClick={()=>{
                            amount=cryproRate5000*1;
                        }}
                        label={cryproRate5000*1}
                        value={cryproRate5000*1}
                        radioGroup="price"
                        variant="radio"
                        className="w-full hover:bg-primary filter-btn"
                />
                <Btn
                        onClick={()=>{
                            amount=cryproRate5000*2;
                        }}
                        label={cryproRate5000*2}
                        value={cryproRate5000*2}
                        radioGroup="price"
                        variant="radio"
                        className="w-full hover:bg-primary filter-btn"
                />
                <Btn
                        onClick={()=>{
                            amount=cryproRate5000*3;
                        }}
                        label={cryproRate5000*3}
                        value={cryproRate5000*3}
                        radioGroup="price"
                        variant="radio"
                        className="w-full hover:bg-primary filter-btn"
                />
            </div>
        </div>
    </div>
    <div class="w-full flex gap-[10px] bg-white dark:bg-blackDark">
        <input
                class={`w-full h-[50px] bg-white3 rounded-[9px] outline-none px-[23px] text-sm font-medium font-normal text-black dark:text-grayLight placeholder:text-grayDark4`}
                type="text"
                disabled
                placeholder="Betting Rate"
                bind:value={betRate}
        />
    </div>
    <div class="w-full flex gap-[10px] bg-white dark:bg-blackDark">
        <button class="flex justify-center items-center cursor-pointer w-full h-[53px] px-[29px] bg-primary rounded-tr-[7px] rounded-br-[7px] dark:text-white"
                on:click={Betting}
        >
            Bet Now
        </button>
    </div>
</div>
