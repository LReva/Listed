import { useNavigate} from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	}
  return (
    <div>
      <h2>Something went wrong. Please return back and try again.</h2>
      <button onClick={goBack}>Back</button>
    </div>
  )
}