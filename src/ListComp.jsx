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
            const updatedLists = [...prev];

            
            if (!updatedLists[targetListIndex].some(i => i.id === item.id)) {
                updatedLists[targetListIndex] = [...updatedLists[targetListIndex], { ...item }];
            }
            return updatedLists;
        });
    };

    const moveBetweenCustomLists = (item, fromIndex, toIndex) => {
        setCustomLists(prev => {
            const updatedLists = [...prev];
            updatedLists[fromIndex]  = updatedLists[fromIndex].filter(i => i.id !== item.id);

            if (!updatedLists[toIndex].some(i => i.id === item.id)) {
                updatedLists[toIndex] = [...updatedLists[toIndex], { ...item }];
            }
            return updatedLists;
        });
    };

    const deleteFromCustomList = (itemId, listIndex) => {
        setCustomLists(prev => {
            const updatedLists = [...prev];
            updatedLists[listIndex] = updatedLists[listIndex].filter(item => item.id !== itemId);
            return updatedLists;
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-blue-100">
            <div className="text-center mb-6">
                <button onClick={createNewList} className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                    Create New List
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded bg-white shadow-md h-80 overflow-y-auto">
                    <h2 className="text-center border-b pb-2 text-blue-700 font-bold">List 1</h2>
                    {list1.map(item => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center p-2 border-b hover:bg-gray-100 transition-colors duration-300"
                        >
                            <p>{item.name}</p>
                            {customLists.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => addToCustomList(item, index)}
                                    className="text-blue-500 hover:text-blue-700 hover:bg-gray-200 rounded-full p-1 transition-colors duration-300"
                                >
                                    ➡️
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                {customLists.map((customList, index) => (
                    <div key={index} className="p-4 border rounded bg-white shadow-md h-80 overflow-y-auto">
                        <h2 className="text-center border-b pb-2 font-bold text-blue-700">Custom List {index + 1}</h2>
                        {customList.map(item => (
                            <div
                                key={item.id}
                                className="flex justify-between items-center p-2 border-b hover:bg-gray-100 transition-colors duration-300"
                            >
                                <p>{item.name}</p>
                                <div>
                                    {index > 0 && (
                                        <button
                                            onClick={() => moveBetweenCustomLists(item, index, index - 1)}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-gray-200 rounded-full p-1 transition-colors duration-300"
                                        >
                                            ⬅️
                                        </button>
                                    )}
                                    {index < customLists.length - 1 && (
                                        <button
                                            onClick={() => moveBetweenCustomLists(item, index, index + 1)}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-gray-200 rounded-full p-1 transition-colors duration-300"
                                        >
                                            ➡️
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteFromCustomList(item.id, index)}
                                        className="text-red-500 hover:text-red-700 hover:bg-gray-200 rounded-full p-1 transition-colors duration-300"
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="p-4 border rounded bg-white shadow-md h-80 overflow-y-auto">
                    <h2 className="text-center border-b pb-2 text-blue-700 font-bold">List 2</h2>
                    {list2.map(item => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center p-2 border-b hover:bg-gray-100 transition-colors duration-300"
                        >
                            {customLists.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => addToCustomList(item, index)}
                                    className="text-blue-500 hover:text-blue-700 hover:bg-gray-200 rounded-full p-1 transition-colors duration-300"
                                >
                                    ⬅️
                                </button>
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
