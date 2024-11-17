/** @[category] {import('./$types').PageLoad} */
export const load = async ({ params }) => {
    const { category, type } = params
    return {
        category,
        type
    }
}
