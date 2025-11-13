
<script lang="ts">
	export let data: { customConfigured?: boolean; customConfigParts?: { hasKey: boolean; hasModel: boolean; hasUrl: boolean } };
	import logoIcon from '$lib/assets/logo.svg?raw';
	import generateIcon from '$lib/assets/generate.svg?raw';
	import downloadIcon from '$lib/assets/download.svg?raw';

	type Provider = 'google' | 'custom';

	interface Question {
		question: string;
		answers: string[];
		correctAnswerIndex: number;
	}

	let topic = '';
	let questionCount = 5;
	let temperature = 0.7;
	let questions: Question[] = [];
	let isLoading = false;
	let error = '';
	let currentQuestionIndex = 0;
	let selectedAnswers: (number | null)[] = [];
	let showResults = false;
	let score = 0;
	let quizStarted = false;
	const customConfigured = data?.customConfigured === true;
	let provider: Provider = customConfigured ? 'custom' : 'google';

	async function requestQuestions(): Promise<Question[]> {
		const response = await fetch('/api/generate-questions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				topic: topic.trim(),
				questionCount,
				temperature,
				provider
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = errorData.error || 'Failed to generate questions';
			const errorDetails = errorData.details ? ` (${errorData.details})` : '';
			throw new Error(errorMessage + errorDetails);
		}

		return response.json();
	}

	async function generateQuestions() {
		if (!topic.trim()) {
			error = 'Please enter a topic';
			return;
		}

		isLoading = true;
		error = '';
		questions = [];
		currentQuestionIndex = 0;
		selectedAnswers = [];
		showResults = false;
		quizStarted = false;
		score = 0;

		try {
			const generatedQuestions = await requestQuestions();
			questions = generatedQuestions;
			selectedAnswers = new Array(questions.length).fill(null);
			quizStarted = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred while generating questions';
		} finally {
			isLoading = false;
		}
	}

	function startQuiz() {
		if (!questions.length) {
			error = 'Generate questions first';
			return;
		}
		quizStarted = true;
		showResults = false;
		currentQuestionIndex = 0;
	}

	function downloadCurrentQuestions() {
		if (!questions.length) {
			error = 'Generate questions before downloading';
			return;
		}
		error = '';
		const sanitizedTopic =
			topic
				.trim()
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '') || 'questions';
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const fileName = `askmaster-${sanitizedTopic}-${questions.length}q-${timestamp}.json`;
		const blob = new Blob([JSON.stringify(questions, null, 2)], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();
		link.remove();
		URL.revokeObjectURL(url);
	}

	function resetToGenerator() {
		questions = [];
		selectedAnswers = [];
		quizStarted = false;
		showResults = false;
		currentQuestionIndex = 0;
		score = 0;
		error = '';
	}

	function selectAnswer(answerIndex: number) {
		if (currentQuestionIndex < questions.length) {
			selectedAnswers[currentQuestionIndex] = answerIndex;
		}
	}

	function nextQuestion() {
		if (currentQuestionIndex < questions.length - 1) {
			currentQuestionIndex++;
		} else {
			calculateResults();
		}
	}

	function previousQuestion() {
		if (currentQuestionIndex > 0) {
			currentQuestionIndex--;
		}
	}

	function calculateResults() {
		score = 0;
		questions.forEach((question, index) => {
			if (selectedAnswers[index] === question.correctAnswerIndex) {
				score++;
			}
		});
		showResults = true;
		quizStarted = false;
	}

	function restartQuiz() {
		currentQuestionIndex = 0;
		selectedAnswers = new Array(questions.length).fill(null);
		showResults = false;
		quizStarted = true;
		score = 0;
	}
</script>

<div class="askmaster">
	<header>
		<h1><span class="icon logo-icon">{@html logoIcon}</span> AskMaster</h1>
		<p>Generate AI-powered multiple-choice questions on any topic!</p>
	</header>

	<main>
		{#if questions.length === 0}
			<section class="generation-form">
				<h2>Generate Questions</h2>
				<form on:submit|preventDefault={generateQuestions}>
					<div class="form-group">
						<label for="topic">Topic *</label>
						<input
							id="topic"
							type="text"
							placeholder="e.g., JavaScript, World History, Biology"
							bind:value={topic}
							required
						/>
					</div>

					<div class="form-row">
						<div class="form-group">
							<label for="questionCount">Number of Questions</label>
							<input
								id="questionCount"
								type="number"
								min="1"
								max="20"
								bind:value={questionCount}
							/>
						</div>

						<div class="form-group">
							<label for="temperature">Creativity Level</label>
							<div class="slider-container">
								<input
									id="temperature"
									type="range"
									min="0"
									max="1"
									step="0.1"
									bind:value={temperature}
								/>
								<span class="temperature-value">{temperature.toFixed(1)}</span>
							</div>
						</div>
					</div>

					<div class="form-group">
						<label for="provider">AI Provider</label>
						<select id="provider" bind:value={provider}>
							<option value="google">Gemini (Google SDK)</option>
							<option value="custom" disabled={!customConfigured}>Custom OpenAI-compatible</option>
						</select>
						{#if customConfigured}
							<p class="helper-text">Custom provider is configured and available.</p>
						{:else}
							<p class="helper-text">Custom provider disabled — missing: {[
								data?.customConfigParts?.hasKey ? null : 'CUSTOM_API_KEY',
								data?.customConfigParts?.hasModel ? null : 'CUSTOM_MODEL',
								data?.customConfigParts?.hasUrl ? null : 'CUSTOM_BASE_URL'
							  ].filter(Boolean).join(', ')}</p>
						{/if}
					</div>

						{#if error}
						<div class="error">
							{error}
						</div>
					{/if}

					<div class="action-row">
						<button type="submit" disabled={isLoading} class="generate-btn">
							{#if isLoading}
								Generating... ⏳
							{:else}
								<span class="icon">{@html generateIcon}</span> Generate Questions
							{/if}
						</button>
					</div>
				</form>
			</section>
		{:else if showResults}
			<section class="results">
				<h2>Quiz Results</h2>
				<div class="score-display">
					<div class="score-circle">
						<span class="score-number">{score}</span>
						<span class="score-total">/ {questions.length}</span>
					</div>
					<p class="score-message">
						{#if score === questions.length}
							🎉 Perfect! You got all questions right!
						{:else if score >= questions.length * 0.8}
							👏 Great job! You did really well!
						{:else if score >= questions.length * 0.6}
							👍 Good effort! Keep practicing!
						{:else}
							💪 Keep learning! You'll do better next time!
						{/if}
					</p>
				</div>

				<div class="answer-review">
					<h3>Review Your Answers</h3>
					{#each questions as question, index}
						<div
							class="question-review"
							class:correct={selectedAnswers[index] === question.correctAnswerIndex}
							class:incorrect={selectedAnswers[index] !== question.correctAnswerIndex && selectedAnswers[index] !== null}
						>
							<p><strong>Q{index + 1}:</strong> {question.question}</p>
							<div class="answers">
								{#each question.answers as answer, answerIndex}
									<div
										class="answer-option"
										class:selected={selectedAnswers[index] === answerIndex}
										class:correct={answerIndex === question.correctAnswerIndex}
									>
										{answer}
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<div class="action-buttons">
					<button on:click={restartQuiz} class="restart-btn">
						<span class="icon">{@html generateIcon}</span> Retry Quiz
					</button>
					<button on:click={downloadCurrentQuestions} class="download-btn">
						<span class="icon">{@html downloadIcon}</span> Download JSON
					</button>
					<button on:click={resetToGenerator} class="new-quiz-btn">
						<span class="icon">{@html generateIcon}</span> Generate New Questions
					</button>
				</div>
			</section>
		{:else if !quizStarted}
			<section class="ready-state">
				<h2>Questions Ready!</h2>
				<p>
					We generated {questions.length} question{questions.length === 1 ? '' : 's'} for
					<strong>{topic || 'your topic'}</strong>. Choose what to do next.
				</p>
				<div class="action-buttons">
					<button type="button" class="generate-btn" on:click={startQuiz}>
						<span class="icon">{@html generateIcon}</span> Play Quiz
					</button>
					<button type="button" class="download-btn" on:click={downloadCurrentQuestions}>
						<span class="icon">{@html downloadIcon}</span> Download JSON
					</button>
				</div>
				<button type="button" class="link-btn" on:click={resetToGenerator}>
					← Back to generator
				</button>
			</section>
		{:else}
			<section class="quiz">
				<div class="quiz-header">
					<h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
					<div class="progress-bar">
						<div class="progress-fill" style="width: {((currentQuestionIndex + 1) / questions.length) * 100}%"></div>
					</div>
				</div>

				<div class="question-container">
					<h3>{questions[currentQuestionIndex].question}</h3>

					<div class="answers">
						{#each questions[currentQuestionIndex].answers as answer, index}
							<button
								class="answer-btn"
								class:selected={selectedAnswers[currentQuestionIndex] === index}
								on:click={() => selectAnswer(index)}
							>
								<span class="answer-letter">{String.fromCharCode(65 + index)}</span>
								{answer}
							</button>
						{/each}
					</div>
				</div>

				<div class="navigation">
					<button
						on:click={previousQuestion}
						disabled={currentQuestionIndex === 0}
						class="nav-btn"
					>
						← Previous
					</button>

					<span class="question-indicator" class:answered={selectedAnswers[currentQuestionIndex] !== null}>
						{selectedAnswers[currentQuestionIndex] !== null ? '✓ Answered' : 'Not answered'}
					</span>

					<button
						on:click={nextQuestion}
						disabled={selectedAnswers[currentQuestionIndex] === null}
						class="nav-btn"
					>
						{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'} →
					</button>
				</div>
			</section>
		{/if}
	</main>
</div>
