let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = e => {
    const db = e.target.result;

    db.createObjectStore("pending", { keyPath: "id", autoIncrement: true});
};

request.onsuccess = e => {
    db  = e.target.result;

    if(navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = (e) => {
    console.log(`Whoops! ${e.target.errorCode}`);
};

const checkDatabase = () => {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.createObjectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((res) => {
                transaction = db.transaction(["pending"], "readwrite");
                const currentStore = transaction.objectStore("pending");
                currentStore.clear();
            })
        }
    }
}

const saveRecord = (record) => {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}



window.addEventListener("online", checkDatabase);
