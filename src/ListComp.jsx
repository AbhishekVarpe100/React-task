import React, { useEffect, useState } from 'react';

function ListComp() {
    const [list1, setList1] = useState([]);
    const [list2, setList2] = useState([]);
    const [mergedLists, setMergedLists] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedLists, setSelectedLists] = useState(new Set());
    const [error, setError] = useState('');

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

    const handleItemSelection = (item, listIndex) => {
        const listId = `List ${listIndex + 1}`;
        const newSelectedLists = new Set(selectedLists);

        if (!selectedItems.includes(item)) {
            if (!selectedLists.has(listId)) {
                if (selectedLists.size < 2) {
                    newSelectedLists.add(listId);
                } else {
                    setError('⚠️ You can select items from only two lists!');
                    return;
                }
            }
        }

        setError('');
        setSelectedLists(newSelectedLists);

        setSelectedItems(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        );
    };

    const mergeSelectedItems = () => {
        if (selectedItems.length > 0) {
            setMergedLists([...mergedLists, { id: mergedLists.length + 1, items: selectedItems }]);
            setSelectedItems([]);
            setSelectedLists(new Set());
        }
    };

    const deleteMergedList = (mergedListId) => {
        setMergedLists(prev => prev.filter(list => list.id !== mergedListId));
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">📜 Selectable Lists</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center transition-opacity duration-500">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {[list1, list2, ...mergedLists.map(m => m.items)].map((list, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">📌 List {index + 1}</h2>
                        <div className="space-y-3">
                            {list.map(item => (
                                <div 
                                    key={item.id} 
                                    className="flex items-center p-3 rounded-lg border hover:bg-gray-100 transition cursor-pointer"
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={selectedItems.includes(item)}
                                        onChange={() => handleItemSelection(item, index)}
                                        className="form-checkbox h-5 w-5 text-blue-600 transition-all"
                                    />
                                    <p className="ml-3 text-gray-800 font-medium">{item.name} - {item.description}</p>
                                </div>
                            ))}
                        </div>
                        
                        {index >= 2 && (
                            <div className="mt-4 text-center">
                                <button 
                                    onClick={() => deleteMergedList(mergedLists[index - 2].id)} 
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                                >
                                    🗑️ Delete List {index + 1}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <button 
                    onClick={mergeSelectedItems} 
                    disabled={selectedItems.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:opacity-90 disabled:bg-gray-400 transition"
                >
                    ✨ Merge Selected Items
                </button>
            </div>
        </div>
    );
}

export default ListComp;
