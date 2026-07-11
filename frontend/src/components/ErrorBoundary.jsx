import { ErrorBoundary } from "react-error-boundary";
export default function AppErrorBoundary({children})
{
    return(
        <ErrorBoundary fallbackRender={({error,resetErrorBoundary})=>{
            return(
                    <div role="alert">
                        <p>Something Went Wrong</p>
                        <pre>{error.message}</pre>
                        <button onClick={()=>{resetErrorBoundary();window.location.reload();}}>Try Again</button>
                    </div>
            )
        }}>
            {children}
        </ErrorBoundary>
    )
}

// <button onClick={resetErrorBoundary}></button> it was like in Error boundary but used window.location.reload() to reload the page so we can get fresh home page as if error is not reseting