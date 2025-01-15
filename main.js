let books = [];

// Membuat Objek Buku
function createBookObject(title, author, year, isComplete) {
    return {
        id: +new Date(),
        title,
        author,
        year: parseInt(year),
        isComplete,
    };
}
// Key Untuk Local Storage
const STORAGE_KEY = 'BOOKSHELF_APPS';

// Simpan Ke Local Storage
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Muat Data Buku Dari Local Storage
function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        books = JSON.parse(data);
    }
}

// Menampilkan Semua Buku Ketika Inputan Dihapus
document.getElementById('searchBookTitle').addEventListener('input', function(event) {
    event.preventDefault();
    const query = this.value.toLowerCase();
    if (query === "") {
        displayBooks(books);
    }
});


// Kolom Pencarian & Tombol Cari Buku
document.getElementById('searchSubmit').addEventListener('click', function(event) {
    event.preventDefault();

    const query = document.getElementById('searchBookTitle').value.toLowerCase();
    filterBook(query);

});

// Tombol Tambah Buku (Tambah & Update)
document.getElementById('bookForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = document.getElementById('bookFormYear').value;
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const editingId = this.getAttribute('data-editing-id');

    if (editingId) {
        updateBook(editingId, title, author, year, isComplete);
    } else {
        addBook(title, author, year, isComplete);
    }

    this.reset();
    this.removeAttribute('data-editing-id');
});

// Memfilter Buku Berdasarkan Judul Buku
function filterBook(query) {
    let filterBook = books;

    if (query) {
        filterBook = books.filter(book => book.title.toLowerCase().includes(query));
    }

    displayBooks(filterBook);
}

// Menambah Buku
function addBook (title, author, year, isComplete) {
    const book = createBookObject(title, author, year, isComplete);
    books.push(book);
    saveToLocalStorage();
    displayBooks();
}

// Mengganti Status Dibaca atau Belum
function toggleBookComplete(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) return;

    books[bookIndex].isComplete = !books[bookIndex].isComplete;

    saveToLocalStorage();
    displayBooks();
}

// Menghapus Buku
function deleteBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) return;

    books.splice(bookIndex, 1);
    saveToLocalStorage();
    displayBooks();
}

// Edit Buku
function editBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) return;

    const book = books[bookIndex];

    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    document.getElementById('bookForm').setAttribute('data-editing-id', bookId);
}

// Update Buku
function updateBook(bookId, title, author, year, isComplete) {
    const bookIndex = books.findIndex(book => book.id === parseInt(bookId));
    if (bookIndex === -1) return;

    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].year = parseInt(year);
    books[bookIndex].isComplete = isComplete;

    saveToLocalStorage();
    displayBooks();
}

// Tampilkan Buku
function displayBooks(filterBook = books) {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    for (const book of filterBook) {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item'); 
        bookElement.setAttribute('data-bookid', book.id);
        bookElement.setAttribute('data-testid', 'bookItem');

        bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton" class="btn-selesai">
          ${book.isComplete ? "Belum Dibaca" : "Selesai Dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton" class="btn-hapus">Hapus Buku</button>
        <button data-testid="bookItemEditButton" class="btn-edit">Edit Buku</button>
      </div>
        `;

        bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', function() {
            toggleBookComplete(book.id);
        });
        bookElement.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', function() {
            deleteBook(book.id)
        })
        bookElement.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', function() {
            editBook(book.id);
        });

        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    }
}

window.addEventListener('load', function() {
    loadFromLocalStorage();
    displayBooks(books);
});