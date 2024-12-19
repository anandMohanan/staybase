import type { Metadata } from 'next';

const title = 'Acme Inc';
const description = 'My application.';


export const metadata: Metadata = {
    title,
    description,
};

const App = async () => {

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        </div >
        </>
    );
};

export default App;
