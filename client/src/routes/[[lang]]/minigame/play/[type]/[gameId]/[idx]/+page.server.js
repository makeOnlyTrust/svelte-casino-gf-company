/** @[category] {import('./$types').PageLoad} */
export const load = async ({ params }) => {
    const { type, gameId, idx } = params
    return {
        type,
        gameId,
        idx
    }
}
