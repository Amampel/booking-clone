import { fetchResults } from "@/lib/fetchResults";
import { notFound } from "next/navigation";

type Props = {
    searchParams: SearchParams;
}

export type SearchParams = {
    url: URL;
    ss: string;
    checkin: string;
    checkout: string;
    src: string;
    group_adults: string
    group_children: string;
    no_rooms: string
}

async function SearchPage({ searchParams }: Props) {
    if (!searchParams.url) return notFound();

    const results = await fetchResults(searchParams)

    if (!results) return <div>No results...</div>

    return (
        <div>SearchPage</div>
    )
}

export default SearchPage