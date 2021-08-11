let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = e => {
    const db = e.target.result;

    db.createObjectStore("budget", { keyPath: "id", autoIncrement: true});
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
    const transaction = db.transaction(["budget"], "readwrite");
    const store = transaction.objectStore("budget");
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((res) => {
                if(res.length !== 0) {
                    transaction = db.transaction(["budget"], "readwrite");
                    const currentStore = transaction.objectStore("budget");
                    currentStore.clear();
                }  
            });
        }
    }
}

const saveRecord = (record) => {
    const transaction = db.transaction(["budget"], "readwrite");
    const store = transaction.objectStore("budget");
    store.add(record);
}



window.addEventListener("online", checkDatabase);
