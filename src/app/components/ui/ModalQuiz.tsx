import Button from "./Button";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

export default function ModalQuiz({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (isOpen: boolean) => void }) {
    const router = useRouter();

    const handleConfirmQuiz = () => {
        setIsModalOpen(false);
        router.push('/quiz');
    };

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Ready to Start?"
            >       
                <div className="space-y-6">
                    <div className="flex items-center space-x-3 text-purple-600 bg-purple-50 p-4 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium">
                            Please make sure you have read and understood all the quiz rules before proceeding.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Quick Reminder:</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>20 multiple choice questions</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>10 minutes time limit</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>+10 points for correct answers</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>-5 points for wrong answers</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                            className="h-11 px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmQuiz}
                            className="h-11 px-6 bg-purple-600 hover:bg-purple-700"
                        >
                            Start Quiz
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}