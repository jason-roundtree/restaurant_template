const sort_AtoZ = array => {
    return array.sort((a, b) => {
        const itemNameA = a.name.toLowerCase()
        const itemNameB = b.name.toLowerCase()
        if (itemNameA < itemNameB) return -1
        if (itemNameA > itemNameB) return 1
        return 0;
    })
}

const sort_ZtoA = array => {
    return array.sort((a, b) => {
        const itemNameA = a.name.toLowerCase()
        const itemNameB = b.name.toLowerCase()
        if (itemNameA > itemNameB) return -1
        if (itemNameA < itemNameB) return 1
        return 0;
    })
}

export { sort_AtoZ, sort_ZtoA }
