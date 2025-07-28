import { usePage } from '@inertiajs/react';

const Show = () => {
    const { quiz } = usePage().props;

    console.log(usePage());
    return <div className="">Quiz Page</div>;
};

export default Show;
