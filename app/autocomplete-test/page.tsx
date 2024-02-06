"use client"
import './layout.css';
import { Autocomplete, AutocompleteItem, NextUIProvider, Textarea } from "@nextui-org/react";

export default function AutocompleteTest() {

    return (<main className="flex min-h-screen flex-col items-center justify-between     p-24">
    <NextUIProvider>
    
                <Autocomplete
                    className='text-part-langid'
                    defaultItems={[
                        {label: "Cat", value: "cat", description: "The second most popular pet in the world"},
                        {label: "Dog", value: "dog", description: "The most popular pet in the world"},
                        {label: "Elephant", value: "elephant", description: "The largest land animal"},
                        {label: "Lion", value: "lion", description: "The king of the jungle"}
                    ]}
                    defaultSelectedKey="cat">
                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
            </NextUIProvider>
    </main>

    );
}