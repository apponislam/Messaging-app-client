export default function MessagesHome() {
    return (
        <div className="flex-1 p-3 flex h-full items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center dark:bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 dark:text-black">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                </div>
                <p className="text-gray-500 dark:text-white">Select a conversation to start messaging</p>
            </div>
        </div>
    );
}
