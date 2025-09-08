import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, InputLabel, TextInput, TextArea, RadioGroup, SingleSelect } from './index';
import { useSignalsContext } from '../contexts';
import { useBrandsContext } from '../contexts';
import type { CreateSignalForm, CopilotType, BrandId } from '../types/enhanced';
import { talkwalkerService, type TalkwalkerCopilot } from '../services/talkwalker';

interface AddSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}


// Use cases for different copilot types
const USE_CASES: Record<CopilotType, Array<{ name: string; prompt: string }>> = {
  'Market Research': [
    { name: 'Sustainable Technology Trends', prompt: 'Analyze market trends and consumer behavior patterns for sustainable technology products. Focus on social media sentiment, search volume, and competitor activity.' },
    { name: 'Healthcare Tech Opportunities', prompt: 'Research emerging market opportunities in the healthcare technology sector. Identify key trends, consumer needs, and competitive landscape.' },
    { name: 'Eco-Friendly Packaging Demand', prompt: 'Monitor market demand for eco-friendly packaging solutions. Track consumer preferences, regulatory changes, and competitor innovations.' }
  ],
  'Social Media': [
    { name: 'Brand Sentiment Monitoring', prompt: 'Monitor social media sentiment for our brand across Twitter, Facebook, and Instagram. Track mentions, sentiment changes, and identify potential PR issues or opportunities.' },
    { name: 'Competitor Social Strategy', prompt: 'Analyze competitor social media strategies and engagement rates. Identify successful content types and posting patterns.' },
    { name: 'Hashtag Performance Tracking', prompt: 'Track hashtag performance and trending topics related to our industry. Identify opportunities for content creation and engagement.' }
  ],
  'Competitive Analysis': [
    { name: 'Competitor Product Launches', prompt: 'Track competitor product launches, pricing changes, marketing campaigns, and market positioning. Alert on significant competitive moves that could impact our market share.' },
    { name: 'Website Change Monitoring', prompt: 'Monitor competitor website changes, new features, and content updates. Identify strategic shifts and new market entries.' },
    { name: 'Customer Review Analysis', prompt: 'Analyze competitor customer reviews and feedback across platforms. Identify their strengths, weaknesses, and areas for improvement.' }
  ],
  'Brand Monitoring': [
    { name: 'Brand Mention Tracking', prompt: 'Monitor brand mentions across all digital channels. Track sentiment, identify influencers, and detect potential reputation issues.' },
    { name: 'Brand Awareness Metrics', prompt: 'Track brand awareness metrics and share of voice in our industry. Compare performance against competitors.' },
    { name: 'IP Protection Monitoring', prompt: 'Monitor unauthorized use of brand assets, trademarks, and intellectual property across the web.' }
  ],
  'Consumer Insights': [
    { name: 'Product Feedback Analysis', prompt: 'Analyze consumer feedback and reviews to identify product improvement opportunities. Track satisfaction trends and common pain points.' },
    { name: 'Consumer Behavior Research', prompt: 'Research consumer preferences and buying behavior patterns. Identify demographic trends and market segments.' },
    { name: 'Feature Request Monitoring', prompt: 'Monitor consumer discussions about our products and services. Identify feature requests and improvement suggestions.' }
  ]
};

const AddSignalModal: React.FC<AddSignalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createSignal } = useSignalsContext();
  const { brands } = useBrandsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CreateSignalForm>({
    name: '',
    prompt: '',
    brandId: '' as BrandId,
    copilotType: 'Market Research',
    tags: [],
  });
  const [promptMode, setPromptMode] = useState<'predefined' | 'custom'>('predefined');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [copilots, setCopilots] = useState<TalkwalkerCopilot[]>([]);
  const [copilotsLoading, setCopilotsLoading] = useState(false);
  const [copilotsError, setCopilotsError] = useState<string | null>(null);

  const handleInputChange = useCallback((field: keyof CreateSignalForm, value: string | BrandId | CopilotType | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleUseCaseSelect = useCallback((useCaseName: string) => {
    setSelectedUseCase(useCaseName);
    const useCases = USE_CASES[formData.copilotType];
    const selectedUseCaseData = useCases.find(uc => uc.name === useCaseName);
    if (selectedUseCaseData) {
      setFormData(prev => ({
        ...prev,
        prompt: selectedUseCaseData.prompt,
      }));
    }
  }, [formData.copilotType]);

  const handlePromptModeChange = useCallback((mode: 'predefined' | 'custom') => {
    setPromptMode(mode);
    if (mode === 'custom') {
      setSelectedUseCase('');
      setFormData(prev => ({
        ...prev,
        prompt: '',
      }));
    } else {
      // Reset to first use case when switching to predefined
      const useCases = USE_CASES[formData.copilotType];
      if (useCases.length > 0) {
        setSelectedUseCase(useCases[0].name);
        setFormData(prev => ({
          ...prev,
          prompt: useCases[0].prompt,
        }));
      }
    }
  }, [formData.copilotType]);

  // Load Talkwalker copilots when modal opens
  useEffect(() => {
    if (!isOpen) return;
    let aborted = false;
    const abort = new AbortController();
    setCopilotsLoading(true);
    setCopilotsError(null);
    talkwalkerService
      .listCopilots(abort.signal)
      .then((list) => {
        if (aborted) return;
        setCopilots(list);
      })
      .catch((err: unknown) => {
        if (aborted) return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to load copilots';
        console.warn('Talkwalker copilots not available:', errorMessage);
        setCopilotsError(errorMessage);
        // Don't block the form - allow users to proceed without copilots
        setCopilots([]);
      })
      .finally(() => {
        if (aborted) return;
        setCopilotsLoading(false);
      });
    return () => {
      aborted = true;
      abort.abort();
    };
  }, [isOpen]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Signal name is required';
    }

    if (!formData.brandId) {
      newErrors.brandId = 'Please select a brand';
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Prompt is required';
    }

    // Only require copilot if copilots are available
    if (copilots.length > 0 && !formData.copilotId) {
      newErrors.copilotId = 'Please select a copilot';
    }

    if (promptMode === 'predefined' && !selectedUseCase) {
      newErrors.useCase = 'Please select a use case';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, promptMode, selectedUseCase]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      await createSignal(formData);
      
      // Reset form
      setFormData({
        name: '',
        prompt: '',
        brandId: '' as BrandId,
        copilotType: 'Market Research',
        tags: [],
      });
      setSelectedUseCase('');
      setPromptMode('predefined');
      
      onSuccess?.();
      onClose();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to create signal' });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, createSignal, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!isLoading) {
      setFormData({
        name: '',
        prompt: '',
        brandId: '' as BrandId,
        copilotType: 'Market Research',
        tags: [],
      });
      setSelectedUseCase('');
      setPromptMode('predefined');
      setErrors({});
      onClose();
    }
  }, [isLoading, onClose]);

  const currentUseCases = USE_CASES[formData.copilotType];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Signal"
      size="xl"
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errors.submit}</div>
          </div>
        )}

        <div className="space-y-6">
          {/* Brand Selection (moved to first position) */}
          <div>
            <InputLabel
              htmlFor="brandId"
              required
              error={!!errors.brandId}
            >
              Brand
            </InputLabel>
            <SingleSelect
              id="brandId"
              options={brands.map(brand => ({ value: brand.id, label: brand.name }))}
              value={formData.brandId}
              onChange={(value) => handleInputChange('brandId', value as BrandId)}
              placeholder="Select a brand"
              error={!!errors.brandId}
              disabled={isLoading}
              ariaDescribedBy={errors.brandId ? 'brandId-error' : undefined}
            />
            {errors.brandId && (
              <p id="brandId-error" className="mt-1 text-sm text-red-600">
                {errors.brandId}
              </p>
            )}
          </div>

          {/* Copilot Selection */}
          <div>
            <InputLabel
              htmlFor="copilotId"
              required={copilots.length > 0}
              error={!!errors.copilotId}
            >
              Copilot
            </InputLabel>
            <SingleSelect
              id="copilotId"
              options={copilots.map(c => ({ value: c.id, label: c.name }))}
              value={formData.copilotId}
              onChange={(value) => handleInputChange('copilotId', value)}
              placeholder={
                copilotsLoading 
                  ? 'Loading copilots...' 
                  : copilots.length === 0 
                    ? 'No copilots available (optional)'
                    : 'Select a copilot'
              }
              disabled={isLoading || copilotsLoading}
              ariaDescribedBy={errors.copilotId ? 'copilotId-error' : undefined}
            />
            {copilotsError && (
              <p className="mt-1 text-sm text-amber-600">
                ⚠️ {copilotsError}. You can still create signals without copilots.
              </p>
            )}
            {errors.copilotId && (
              <p id="copilotId-error" className="mt-1 text-sm text-red-600">
                {errors.copilotId}
              </p>
            )}
          </div>
          {/* Signal Name */}
          <div>
            <InputLabel
              htmlFor="name"
              required
              error={!!errors.name}
            >
              Signal Name
            </InputLabel>
            <TextInput
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter signal name"
              error={!!errors.name}
              disabled={isLoading}
              ariaDescribedBy={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          

          {/* Prompt Mode Toggle */}
          <div>
            <InputLabel
              required
              aria-labelledby="promptMode-label"
            >
              Prompt Type
            </InputLabel>
            <RadioGroup
              name="promptMode"
              options={[
                { value: 'predefined', label: 'Predefined Use Cases' },
                { value: 'custom', label: 'Custom Prompt' },
              ]}
              value={promptMode}
              onChange={(value) => handlePromptModeChange(value as 'predefined' | 'custom')}
              disabled={isLoading}
              ariaLabelledBy="promptMode-label"
            />
          </div>

          {/* Conditional Content Based on Prompt Mode */}
          {promptMode === 'predefined' ? (
            <div>
              <InputLabel
                htmlFor="useCase"
                required
                error={!!errors.useCase}
              >
                Use Case
              </InputLabel>
              <SingleSelect
                id="useCase"
                options={currentUseCases.map((useCase) => ({ value: useCase.name, label: useCase.name }))}
                value={selectedUseCase}
                onChange={handleUseCaseSelect}
                placeholder="Select a use case"
                error={!!errors.useCase}
                disabled={isLoading}
                ariaDescribedBy={errors.useCase ? 'useCase-error' : undefined}
              />
              {errors.useCase && (
                <p id="useCase-error" className="mt-1 text-sm text-red-600">
                  {errors.useCase}
                </p>
              )}
            </div>
          ) : (
            <div>
              <InputLabel
                htmlFor="prompt"
                required
                error={!!errors.prompt}
              >
                Custom Prompt
              </InputLabel>
              <TextArea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                placeholder="Enter your custom prompt"
                autoResize
                minRows={6}
                maxRows={12}
                error={!!errors.prompt}
                disabled={isLoading}
                ariaDescribedBy={errors.prompt ? 'prompt-error' : undefined}
              />
              {errors.prompt && (
                <p id="prompt-error" className="mt-1 text-sm text-red-600">
                  {errors.prompt}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Signal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSignalModal;
