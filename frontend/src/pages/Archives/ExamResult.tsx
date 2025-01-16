import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { apiGetExamResult } from '~api/exam-result';

function ExamResult() {
    const { id } = useParams();
    const queryData = useQuery({
        queryKey: ['test', { id: id }],
        queryFn: () => apiGetExamResult(String(id))
    });
    if (queryData.data) console.log(queryData.data);
    return (
        <>{id}</>
    );
}

export default ExamResult;