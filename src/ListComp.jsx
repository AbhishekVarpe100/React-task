import React, { useEffect, useState } from 'react';

function ListComp() {
    const [list1, setList1] = useState([]);
    const [list2, setList2] = useState([]);
    const [customLists, setCustomLists] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('https://apis.ccbp.in/list-creation/lists');
                const result = await res.json();
                setList1(result.lists.filter(item => item.list_number === 1));
                setList2(result.lists.filter(item => item.list_number === 2));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getData();
    }, []);

    const createNewList = () => {
        setCustomLists(prev => [...prev, []]);
    };

    const addToCustomList = (item, targetListIndex) => {
        setCustomLists(prev => {
            if (!prev[targetListIndex].find(i => i.id === item.id)) {
                const updatedLists = [...prev];
                updatedLists[targetListIndex] = [...updatedLists[targetListIndex], item];
                return updatedLists;
            }
            return prev;
        });
    };

    const moveBetweenCustomLists = (item, fromIndex, toIndex) => {
        setCustomLists(prev => {
            const updatedLists = [...prev];
            updatedLists[fromIndex] = updatedLists[fromIndex].filter(i => i.id !== item.id);
            if (!updatedLists[toIndex].find(i => i.id === item.id)) {
                updatedLists[toIndex] = [...updatedLists[toIndex], item];
            }
            return updatedLists;
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-6">
                <button onClick={createNewList} className="px-4 py-2 bg-violet-300 rounded-lg border rounded">Create New List</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded">
                    <h2 className="text-center border-b pb-2">List 1</h2>
                    {list1.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 border-b">
                            <p>{item.name}</p>
                            {customLists.map((_, index) => (
                                <button key={index} onClick={() => addToCustomList(item, index)}>➡️</button>
                            ))}
                        </div>
                    ))}
                </div>

                {customLists.map((customList, index) => (
                    <div key={index} className="p-4 border rounded">
                        <h2 className="text-center border-b pb-2">Custom List {index + 1}</h2>
                        {customList.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-2 border-b">
                                <p>{item.name}</p>
                                <div>
                                    {index > 0 && (
                                        <button onClick={() => moveBetweenCustomLists(item, index, index - 1)}>⬅️</button>
                                    )}
                                    {index < customLists.length - 1 && (
                                        <button onClick={() => moveBetweenCustomLists(item, index, index + 1)}>➡️</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="p-4 border rounded">
                    <h2 className="text-center border-b pb-2">List 2</h2>
                    {list2.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 border-b">
                            {customLists.map((_, index) => (
                                <button key={index} onClick={() => addToCustomList(item, index)}>⬅️</button>
                            ))}
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListComp;
