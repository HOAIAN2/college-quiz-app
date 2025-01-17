import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { apiGetExamResult } from '~api/exam-result';
import QUERY_KEYS from '~constants/query-keys';

function ExamResult() {
    const { resultId } = useParams();
    const queryData = useQuery({
        queryKey: [QUERY_KEYS.EXAM_RESULT, { id: resultId }],
        queryFn: () => apiGetExamResult(String(resultId))
    });
    if (queryData.data) console.log(queryData.data);
    return (
        <></>
    );
}

export default ExamResult;