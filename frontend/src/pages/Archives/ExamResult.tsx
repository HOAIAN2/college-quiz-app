import { useParams } from 'react-router-dom';

function ExamResult() {
    // Show exam detail, exam result
    const { examId } = useParams();
    return (
        <>
            <main>Exam result {examId}</main>
        </>
    );
}

export default ExamResult;