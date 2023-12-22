"use client"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          
                    <code className="font-mono font-bold"></code>
                </p>

                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                    Login
                    </a>
                </div>
            </div>

            <div>
                <Tabs>
                    <TabList>
                        <Tab>Add</Tab>
                        <Tab>Lib</Tab>
                        <Tab>Quiz</Tab>
                        <Tab>Dict</Tab>
                        <Tab>About</Tab>
                    </TabList>

                    <TabPanel>
                      <h2>Any content 1</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>Any content 2</h2>
                    </TabPanel>
                    <TabPanel>
    <h2>Any content 3</h2>
</TabPanel>
<TabPanel>
    <h2>Any content 4</h2>
</TabPanel>
<TabPanel>
    <h2>Any content 5</h2>
</TabPanel>

</Tabs>
        </div>

        </main>
    );
};